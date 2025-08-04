const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const TelegramBot = require('node-telegram-bot-api');
const qrcode = require('qrcode');
const fs = require('fs');

// Replace with your Telegram Bot Token
const token = '<BOT_TOKEN_HERE>';
const bot = new TelegramBot(token, { polling: true });

// --- STATE MANAGEMENT ---
// Object to store whatsapp-web.js clients for each user
const clients = {};
// Object to track user states (e.g., if they are sending a new message)
const userState = {};

// --- Helper Functions ---

function createClient(chatId) {
    console.log(`Creating client for ${chatId}`);
    const client = new Client({
        authStrategy: new LocalAuth({ clientId: `client-${chatId}` }),
        puppeteer: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    });

    client.on('qr', (qr) => {
        console.log(`QR received for ${chatId}`);
        qrcode.toDataURL(qr, (err, url) => {
            if (err) {
                console.error('Error generating QR code:', err);
                bot.sendMessage(chatId, 'Error generating QR code. Please try again.');
                return;
            }
            bot.sendPhoto(chatId, Buffer.from(url.split(',')[1], 'base64'), {
                caption: 'Scan this QR code with your phone to connect to WhatsApp.'
            }).catch(e => console.error('Error sending QR code photo:', e));
        });
    });

    client.on('ready', () => {
        console.log(`WhatsApp client is ready for ${chatId}`);
        bot.sendMessage(chatId, 'WhatsApp client is connected and ready! 🎉');
        clients[chatId] = client;
    });

    client.on('message', async (message) => {
        const chat = await message.getChat();
        const contact = await message.getContact();
        const senderName = contact.pushname || contact.name || `+${contact.number}`;
        const senderNumber = `+${contact.number}`;
        const chatName = chat.isGroup ? ` in group "${chat.name}"` : '';
        let caption = `*New message from ${senderName} (${senderNumber})${chatName}:*\n\n`;

        if (message.hasMedia) {
            const media = await message.downloadMedia();
            if (media) {
                const mediaBuffer = Buffer.from(media.data, 'base64');
                bot.sendPhoto(chatId, mediaBuffer, {
                    caption: caption + (message.body || ''),
                    parse_mode: 'Markdown'
                }).then(sentMessage => {
                    if (!clients[chatId].messageMap) clients[chatId].messageMap = new Map();
                    clients[chatId].messageMap.set(sentMessage.message_id, message.from);
                });
            }
        } else {
            bot.sendMessage(chatId, caption + message.body, { parse_mode: 'Markdown' }).then(sentMessage => {
                if (!clients[chatId].messageMap) clients[chatId].messageMap = new Map();
                clients[chatId].messageMap.set(sentMessage.message_id, message.from);
            });
        }
    });

    client.on('disconnected', (reason) => {
        console.log(`Client for ${chatId} was logged out:`, reason);
        bot.sendMessage(chatId, 'You have been logged out from WhatsApp.');
        delete clients[chatId];
        const sessionPath = `./.wwebjs_auth/client-${chatId}`;
        if (fs.existsSync(sessionPath)) {
            fs.rmSync(sessionPath, { recursive: true, force: true });
        }
    });

    client.initialize().catch(e => console.error(`Failed to initialize client for ${chatId}:`, e));
}


// --- Telegram Bot Commands ---

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const startMessage = `
Welcome to the WhatsApp-Telegram Bridge Bot! 🤖

This bot allows you to connect your WhatsApp account and manage your chats directly from Telegram.

Use /scan to begin, or type /help to see the full list of commands.
    `;
    bot.sendMessage(chatId, startMessage.trim());
});

bot.onText(/\/scan/, (msg) => {
    const chatId = msg.chat.id;
    if (clients[chatId]) {
        bot.sendMessage(chatId, 'You are already connected. Use /logout to disconnect first.');
    } else {
        bot.sendMessage(chatId, 'Generating QR code...');
        createClient(chatId);
    }
});

// --- NEW FEATURE: /send command ---
bot.onText(/\/send (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const number = match[1];

    if (!clients[chatId]) {
        return bot.sendMessage(chatId, 'You must be connected to WhatsApp first. Use /scan.');
    }

    // Basic number validation to ensure it looks like a phone number
    if (!/^\+?\d{10,15}$/.test(number)) {
        return bot.sendMessage(chatId, 'Invalid number format. Please use the format: `/send +1234567890`');
    }

    userState[chatId] = { action: 'awaiting_message', number: number };
    bot.sendMessage(chatId, `Great! Now send the message (text or image) that you want to deliver to *${number}*.\n\nOr use /cancel to abort this action.`, { parse_mode: 'Markdown' });
});

// --- NEW FEATURE: /cancel command ---
bot.onText(/\/cancel/, (msg) => {
    const chatId = msg.chat.id;
    if (userState[chatId]) {
        delete userState[chatId];
        bot.sendMessage(chatId, 'Operation canceled.');
    } else {
        bot.sendMessage(chatId, 'There is no ongoing operation to cancel.');
    }
});


bot.onText(/\/logout/, async (msg) => {
    const chatId = msg.chat.id;
    if (clients[chatId]) {
        await clients[chatId].logout();
        bot.sendMessage(chatId, 'Successfully logged out.');
    } else {
        bot.sendMessage(chatId, 'You are not connected.');
    }
});

// --- MODIFICATION: Updated /help command ---
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const helpMessage = `
*Welcome to the WhatsApp-Telegram Bridge Bot!* 🤖

This bot helps you connect your WhatsApp account and manage your chats directly from Telegram.

*Main Commands:*
➡️ */start*
Displays the initial welcome message.

➡️ */scan*
Generates a QR code to link your WhatsApp account.

➡️ */logout*
Disconnects your WhatsApp account from the bot.

➡️ */help*
Shows this help message.

*Sending Messages:*
➡️ */send <number>*
Starts the process of sending a message to a new WhatsApp number (e.g., \`/send +1234567890\`). The bot will then wait for you to send the content of the message.

➡️ */cancel*
Aborts the */send* process if you change your mind.

*How to Reply:*
When you receive a forwarded message, use Telegram's 'Reply' feature on that message to send your response back to the original WhatsApp chat.
    `;
    bot.sendMessage(chatId, helpMessage.trim(), { parse_mode: 'Markdown' });
});


// --- Main Message Handler (for replies and new messages) ---

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    // Ignore commands so they are not processed by this handler
    if (msg.text && msg.text.startsWith('/')) {
        return;
    }

    const client = clients[chatId];
    if (!client) return;

    // --- NEW: Logic to handle sending a new message ---
    if (userState[chatId] && userState[chatId].action === 'awaiting_message') {
        const number = userState[chatId].number;
        // Format number to WhatsApp's internal ID
        const whatsappChatId = (number.startsWith('+') ? number.substring(1) : number) + "@c.us";

        // Clear the user's state immediately to prevent accidental double-sends
        delete userState[chatId];

        try {
            bot.sendMessage(chatId, `Sending your message to *${number}*...`, { parse_mode: 'Markdown' });
            if (msg.photo) {
                const photo = msg.photo[msg.photo.length - 1];
                const fileStream = bot.getFileStream(photo.file_id);
                const chunks = [];
                for await (const chunk of fileStream) { chunks.push(chunk); }
                const buffer = Buffer.concat(chunks);
                const media = new MessageMedia('image/jpeg', buffer.toString('base64'), 'image.jpg');
                await client.sendMessage(whatsappChatId, media, { caption: msg.caption || '' });
                bot.sendMessage(chatId, `✅ Image sent successfully to *${number}*!`, { parse_mode: 'Markdown' });
            } else if (msg.text) {
                await client.sendMessage(whatsappChatId, msg.text);
                bot.sendMessage(chatId, `✅ Message sent successfully to *${number}*!`, { parse_mode: 'Markdown' });
            }
        } catch (error) {
            console.error(`Failed to send message to ${number}:`, error);
            bot.sendMessage(chatId, `❌ Failed to send message to *${number}*. Please make sure the number is correct and has an active WhatsApp account.`, { parse_mode: 'Markdown' });
        }
        return; // Stop further processing
    }

    // --- EXISTING: Logic to handle replies ---
    if (msg.reply_to_message && client.messageMap) {
        const originalMessageId = msg.reply_to_message.message_id;
        const whatsappChatId = client.messageMap.get(originalMessageId);

        if (whatsappChatId) {
            try {
                if (msg.photo) {
                    const photo = msg.photo[msg.photo.length - 1];
                    const fileStream = bot.getFileStream(photo.file_id);
                    const chunks = [];
                    for await (const chunk of fileStream) { chunks.push(chunk); }
                    const buffer = Buffer.concat(chunks);
                    const media = new MessageMedia('image/jpeg', buffer.toString('base64'), 'image.jpg');
                    await client.sendMessage(whatsappChatId, media, { caption: msg.caption || '' });
                    bot.sendMessage(chatId, '✅ Image reply sent to WhatsApp!');
                } else if (msg.text) {
                    await client.sendMessage(whatsappChatId, msg.text);
                    bot.sendMessage(chatId, '✅ Reply sent to WhatsApp!');
                }
            } catch (error) {
                console.error('Failed to send reply to WhatsApp:', error);
                bot.sendMessage(chatId, '❌ Sorry, failed to send the reply to WhatsApp.');
            }
        }
    }
});

console.log('Telegram bot started...');
