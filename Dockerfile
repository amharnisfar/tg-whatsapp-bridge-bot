# 1. Use an official Node.js runtime as a parent image
FROM node:18-bullseye

# 2. Install the complete and correct system dependencies required by Puppeteer
# This list is the comprehensive set needed for headless Chrome to run.
RUN apt-get update && apt-get install -y \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    libappindicator1 \
    libnss3 \
    lsb-release \
    xdg-utils \
    wget \
    # Added based on recent errors
    libgbm-dev \
    libdrm2 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# 3. Set the working directory in the container
WORKDIR /app

# 4. Copy the package.json and package-lock.json files
COPY package*.json ./

# 5. Install the application's dependencies
RUN npm ci --only=production

# 6. Copy the rest of your application's code to the container
COPY . .

# 7. Command to run the application (e.g., 'wa.js')
CMD ["node", "wa.js"]
