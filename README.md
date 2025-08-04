<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

</head>
<body bgcolor="#FFFFFF">
<div style="width: 100%; max-width: 900px; margin: 0 auto; font-family: Helvetica, Arial, sans-serif; line-height: 1.6; padding: 20px; box-sizing: border-box;">
<h1 style="font-size: 24px; margin: 10px 0;">
<img src="https://img.icons8.com/color/48/000000/telegram-app.png" alt="Telegram Logo" valign="middle" style="width: 40px; height: 40px;">
WhatsApp-Telegram Bridge Bot
<img src="https://img.icons8.com/color/48/000000/whatsapp.png" alt="WhatsApp Logo" valign="middle" style="width: 40px; height: 40px;">
</h1>
<p>This project provides a powerful and easy-to-use bot that acts as a bridge between your WhatsApp account and Telegram. It allows you to receive all your WhatsApp messages directly in a Telegram chat and reply to them seamlessly. You can also initiate new conversations with any WhatsApp contact directly from Telegram.</p>
<!-- Button -->
<table border="0" cellspacing="0" cellpadding="0" style="margin-top: 15px; margin-bottom: 15px;">
<tr>
<td bgcolor="#0088CC" style="border-radius: 5px;">
<a href="https://t.me/aharwhatsappbot" target="_blank" style="text-decoration: none; display: inline-block; padding: 12px 18px;">
<font color="#FFFFFF" face="Helvetica, Arial, sans-serif" size="4">
<b> Try a Sample Bot </b>
</font>
</a>
</td>
</tr>
</table>
<hr>
<h2>✨ Features</h2>
<ul>
<li><b>Multi-User Support</b>: Each Telegram user connects their own independent WhatsApp account.</li>
<li><b>Message Forwarding</b>: Forwards incoming WhatsApp messages (including text, images, and captions) to your Telegram chat.</li>
<li><b>Direct Replies</b>: Simply use Telegram's reply feature to send a message back to the original WhatsApp chat.</li>
<li><b>Initiate New Chats</b>: Use the <code>/send</code> command to start a conversation with any WhatsApp number.</li>
<li><b>Secure QR Code Login</b>: A QR code is generated and sent directly to your private Telegram chat for you to scan.</li>
<li><b>Session Persistence</b>: Your session is saved locally, so you don't have to scan the QR code every time you restart the bot.</li>
<li><b>Easy Logout</b>: A simple <code>/logout</code> command disconnects your account and cleans up the session files.</li>
<li><b>Dockerized</b>: Comes with a fully configured Dockerfile for easy, dependency-free deployment.</li>
</ul>
<hr>
<h2>⚙️ How It Works</h2>
<p>The bot is built on Node.js and orchestrates two main libraries:</p>
<ol>
<li><strong><code>whatsapp-web.js</code></strong>: A powerful library that runs a headless instance of Chrome to automate WhatsApp Web, providing an API to send and receive messages.</li>
<li><strong><code>node-telegram-bot-api</code></strong>: A straightforward library to interact with the Telegram Bot API, used for handling commands and relaying messages.</li>
</ol>
<p>When you start the bot and use the <code>/scan</code> command, it initializes a new <code>whatsapp-web.js</code> client for your chat ID. This client generates a QR code, which is sent to you via the Telegram bot. Once you scan it, the client is authenticated and starts listening for incoming WhatsApp messages, forwarding them to you. Replying in Telegram triggers the bot to send your message back through the corresponding WhatsApp client.</p>
<hr>
<h2> Installation & Setup</h2>
<p>You can run the bot either locally or using Docker. First, get a <strong>Telegram Bot Token</strong> from <a href="https://t.me/BotFather" target="_blank">BotFather</a>. Then, paste the provided code into a file named <code>wa.js</code> and replace <code><BOT_TOKEN_HERE></code> with your token.</p>
<h3><u>Method 1: Running with Docker (Recommended)</u></h3>
<p>This method handles all system dependencies automatically.</p>
<ol>
<li><strong>Install Docker</strong>: Ensure Docker is installed on your system.</li>
<li><strong>Build the Docker Image</strong>:
<div style="background-color: #f6f8fa; padding: 10px; border-radius: 5px; margin: 10px 0;">
<pre><code>docker build -t whatsapp-telegram-bridge .</code></pre>
</div>
</li>
<li><strong>Run the Docker Container</strong>:
<div style="background-color: #f6f8fa; padding: 10px; border-radius: 5px; margin: 10px 0;">
<pre><code>docker run -d --name wa-bridge --restart unless-stopped -v wwebjs_auth:/app/.wwebjs_auth whatsapp-telegram-bridge</code></pre>
</div>
</li>
<li><strong>Check Logs (Optional)</strong>:
<div style="background-color: #f6f8fa; padding: 10px; border-radius: 5px; margin: 10px 0;">
<pre><code>docker logs -f wa-bridge</code></pre>
</div>
</li>
</ol>
<h3><u>Method 2: Local Run on Linux (Debian/Ubuntu)</u></h3>
<div style="background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
<strong>Important for Servers/Headless Systems:</strong> The following dependencies are crucial for running Chrome in a headless environment.
</div>
<ol>
<li><strong>Install Node.js</strong>: Ensure Node.js v18 or newer is installed.</li>
<li><strong>Install System Dependencies</strong>:
<div style="background-color: #f6f8fa; padding: 10px; border-radius: 5px; margin: 10px 0; font-size: 13px;">
<pre><code>sudo apt-get update && sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget libgbm-dev libdrm2 --no-install-recommends</code></pre>
</div>
</li>
<li><strong>Install Node Modules</strong>:
<div style="background-color: #f6f8fa; padding: 10px; border-radius: 5px; margin: 10px 0;">
<pre><code>npm install</code></pre>
</div>
</li>
<li><strong>Run the Bot</strong>:
<div style="background-color: #f6f8fa; padding: 10px; border-radius: 5px; margin: 10px 0;">
<pre><code>node wa.js</code></pre>
</div>
</li>
</ol>
<h3><u>Method 3: Local Run on Windows</u></h3>
<ol>
<li><strong>Install Node.js</strong>: Download and install Node.js v18+ from the <a href="https://nodejs.org/" target="_blank">official website</a>.</li>
<li><strong>Install Node Modules</strong>: Navigate to the project directory in PowerShell or CMD and run:
<div style="background-color: #f6f8fa; padding: 10px; border-radius: 5px; margin: 10px 0;">
<pre><code>npm install</code></pre>
</div>
</li>
<li><strong>Run the Bot</strong>:
<div style="background-color: #f6f8fa; padding: 10px; border-radius: 5px; margin: 10px 0;">
<pre><code>node wa.js</code></pre>
</div>
</li>
</ol>
<hr>
<h2>烙 Bot Commands & Usage</h2>
<ul>
<li><code>/start</code>: Displays the welcome message.</li>
<li><code>/scan</code>: Generates a QR code to link your WhatsApp account.</li>
<li><code>/send <number></code>: Initiates sending a message (e.g., <code>/send +1234567890</code>).</li>
<li><code>/cancel</code>: Aborts the <code>/send</code> process.</li>
<li><code>/logout</code>: Disconnects your WhatsApp account.</li>
<li><code>/help</code>: Shows the help message.</li>
</ul>
<h3>Replying to Messages</h3>
<p>When a WhatsApp message is forwarded to you, use Telegram's native <strong>'Reply'</strong> feature on that message. Your response will be sent back to the correct WhatsApp chat.</p>
<hr>
<p style="text-align: right; font-size: 12px; color: #666666;">
© 2025 Amhar Nisfer Dev, Inc
</p>
</div>
</body>
</html>
