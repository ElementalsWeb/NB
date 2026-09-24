# Serve the production build committed to this repository.
FROM node:24-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --include=dev --no-audit --no-fund

COPY . /app/

CMD ["node", "server.js"]
