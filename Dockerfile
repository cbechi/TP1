FROM node:20

# Variable para que Puppeteer descargue Chromium
ENV PUPPETEER_PRODUCT=chrome
ENV PUPPETEER_SKIP_DOWNLOAD=false

# Carpeta de trabajo
WORKDIR /app

# Copiar archivos
COPY package*.json ./
RUN npm install

# Copiar código
COPY . .

# Instalar dependencias necesarias para Puppeteer
RUN apt-get update && apt-get install -y \
    wget ca-certificates fonts-liberation libappindicator3-1 libasound2 \
    libatk-bridge2.0-0 libatk1.0-0 libcups2 libdbus-1-3 libgdk-pixbuf2.0-0 \
    libnspr4 libnss3 libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2 \
    libgbm1 xdg-utils tzdata --no-install-recommends \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

# Timezone local (ejemplo: Argentina)
ENV TZ=America/Argentina/Buenos_Aires

CMD ["node", "index.js"]

