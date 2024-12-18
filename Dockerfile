FROM node:22-alpine

RUN mkdir -p /app
WORKDIR /app

RUN npm install -g pnpm

COPY ./package*.json ./
COPY ./pnpm-lock.yaml ./
COPY ./dist ./src

RUN pnpm install

CMD [ "node", "src/application/api/main.js" ]
