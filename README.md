<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>WhatsApp-Telegram Bridge Bot README</title>
</head>
<body bgcolor="#FFFFFF">
<table width="900" align="center" border="1" cellpadding="20" cellspacing="0" bordercolor="#DDDDDD" style="font-family: Helvetica, Arial, sans-serif; line-height: 1.6;">
<tr>
<td>
<table width="100%" border="0" cellspacing="0" cellpadding="0">
<tr>
<td align="center">
<h1>
<img src="https://img.icons8.com/color/48/000000/telegram-app.png" alt="Telegram Logo" valign="middle">
WhatsApp-Telegram Bridge Bot
<img src="https://img.icons8.com/color/48/000000/whatsapp.png" alt="WhatsApp Logo" valign="middle">
</h1>
</td>
</tr>
<tr>
<td align="center">
<p>This project provides a powerful and easy-to-use bot that acts as a bridge between your WhatsApp account and Telegram. It allows you to receive all your WhatsApp messages directly in a Telegram chat and reply to them seamlessly. You can also initiate new conversations with any WhatsApp contact directly from Telegram.</p>
<!-- Button -->
<table border="0" cellspacing="0" cellpadding="12" style="margin-top: 15px; margin-bottom: 15px;">
<tr>
<td bgcolor="#0088CC" style="border-radius: 5px;">
<a href="https://t.me/aharwhatsappbot" target="_blank" style="text-decoration: none;">
<font color="#FFFFFF" face="Helvetica, Arial, sans-serif" size="4">
<b> Try a Sample Bot </b>
</font>
</a>
</td>
</tr>
</table>
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
<p>You can run the bot either locally on your machine (Linux or Windows) or using Docker. Before you begin, you need to get a <strong>Telegram Bot Token</strong> from <a href="https://t.me/BotFather" target="_blank">BotFather</a> on Telegram.</p>
<p>Once you have the token, clone this repository and create a file named <code>wa.js</code>. Paste the provided code into this file and replace <code><BOT_TOKEN_HERE></code> with your actual token.</p>
<h3><u>Method 1: Running with Docker (Recommended)</u></h3>
<p>This is the easiest and most reliable method as it handles all system dependencies automatically.</p>
<ol>
<li><strong>Install Docker</strong>: Make sure you have Docker installed on your system.</li>
<li><strong>Build the Docker Image</strong>: Open a terminal in the project's root directory and run:
<table width="100%" bgcolor="#f6f8fa" cellpadding="10" style="border-radius: 5px;"><tr><td><pre><code>docker build -t whatsapp-telegram-bridge .</code></pre></td></tr></table>
</li>
<li><strong>Run the Docker Container</strong>: To run the bot in the background and ensure your WhatsApp session persists even if you restart the container, run the following command. This command creates a named volume <code>wwebjs_auth</code> to store session data.
<table width="100%" bgcolor="#f6f8fa" cellpadding="10" style="border-radius: 5px;"><tr><td><pre><code>docker run -d --name wa-bridge --restart unless-stopped -v wwebjs_auth:/app/.wwebjs_auth whatsapp-telegram-bridge</code></pre></td></tr></table>
</li>
<li><strong>Check Logs (Optional)</strong>: To see the bot's logs and confirm it's running, use:
<table width="100%" bgcolor="#f6f8fa" cellpadding="10" style="border-radius: 5px;"><tr><td><pre><code>docker logs -f wa-bridge</code></pre></td></tr></table>
</li>
</ol>
<h3><u>Method 2: Local Run on Linux (Debian/Ubuntu)</u></h3>
<table width="100%" border="1" cellpadding="15" cellspacing="0" bordercolor="#ffeeba" bgcolor="#fff3cd" style="border-radius: 5px;">
<tr><td><font color="#856404">
<strong>Important for Servers/Headless Systems:</strong> The following dependencies are crucial for running Chrome in a headless environment, especially on systems without a graphical user interface (GPU).
</font></td></tr>
</table>
<br>
<ol>
<li><strong>Install Node.js</strong>: Make sure you have Node.js v18 or newer installed.</li>
<li><strong>Install System Dependencies</strong>: Run the following command to install all necessary libraries for Puppeteer:
<table width="100%" bgcolor="#f6f8fa" cellpadding="10" style="border-radius: 5px;"><tr><td><pre><code>sudo apt-get update && sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget libgbm-dev libdrm2 --no-install-recommends</code></pre></td></tr></table>
</li>
<li><strong>Install Node Modules</strong>: In the project directory, run:
<table width="100%" bgcolor="#f6f8fa" cellpadding="10" style="border-radius: 5px;"><tr><td><pre><code>npm install</code></pre></td></tr></table>
</li>
<li><strong>Run the Bot</strong>: Start the application using:
<table width="100%" bgcolor="#f6f8fa" cellpadding="10" style="border-radius: 5px;"><tr><td><pre><code>node wa.js</code></pre></td></tr></table>
</li>
</ol>
<h3><u>Method 3: Local Run on Windows</u></h3>
<ol>
<li><strong>Install Node.js</strong>: Download and install the latest LTS version of Node.js (v18+) from the <a href="https://nodejs.org/" target="_blank">official website</a>.</li>
<li><strong>Open a Terminal</strong>: Use PowerShell or Command Prompt.</li>
<li><strong>Install Node Modules</strong>: Navigate to the project directory and run:
<table width="100%" bgcolor="#f6f8fa" cellpadding="10" style="border-radius: 5px;"><tr><td><pre><code>npm install</code></pre></td></tr></table>
<p>On Windows, npm will attempt to download a compatible version of Chromium, so manual system dependency installation is usually not required.</p>
</li>
<li><strong>Run the Bot</strong>: Start the application:
<table width="100%" bgcolor="#f6f8fa" cellpadding="10" style="border-radius: 5px;"><tr><td><pre><code>node wa.js</code></pre></td></tr></table>
</li>
</ol>
<hr>
<h2>烙 Bot Commands & Usage</h2>
<p>Interact with your bot on Telegram using these commands:</p>
<ul>
<li><code>/start</code>: Displays the initial welcome message.</li>
<li><code>/scan</code>: Generates a QR code to link your WhatsApp account. Open the chat with the bot and it will send you the QR code as an image. Scan it with your WhatsApp mobile app (Linked Devices).</li>
<li><code>/send <number></code>: Initiates sending a message to a new number. For example: <code>/send +1234567890</code>. The bot will then ask you to send the message content (text or image) you want to deliver.</li>
<li><code>/cancel</code>: Aborts the <code>/send</code> process.</li>
<li><code>/logout</code>: Disconnects your WhatsApp account, logs you out, and clears the session data.</li>
<li><code>/help</code>: Shows a detailed help message with all available commands.</li>
</ul>
<h3>Replying to Messages</h3>
<p>When a WhatsApp message is forwarded to you, simply use Telegram's native <strong>'Reply'</strong> feature on that message. Type your response, and it will be sent back to the correct WhatsApp chat automatically.</p>
<hr>
<h2>️ Dockerfile Explained</h2>
<p>The provided <code>Dockerfile</code> creates an optimized and stable environment for the bot.</p>
<table width="100%" bgcolor="#f6f8fa" cellpadding="10" style="border-radius: 5px;"><tr><td><pre><code># Use an official Node.js 18 image
FROM node:18-bullseye

# Install all necessary system dependencies for headless Chrome
RUN apt-get update && apt-get install -y \
    gconf-service libasound2 ... libgbm-dev libdrm2 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies securely
COPY package*.json ./
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Define the command to run the application
CMD ["node", "wa.js"]
</code></pre></td></tr></table>
<hr>
<p align="center">
<font size="-1" color="#666666">
© 2025 Amhar Nisfer Dev, Inc
</font>
</p>
</td>
</tr>
</table>
</body>
</html>
