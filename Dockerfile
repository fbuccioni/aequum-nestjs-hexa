FROM node:22-alpine

# Workdir
RUN mkdir -p /app
WORKDIR /app

# Copying package and source files
COPY ./package*.json ./pnpm-lock.yaml ./
COPY ./dist ./dist

# Installing dependencies
RUN npm install -g pnpm
RUN pnpm install -P

# Run API application
ENTRYPOINT [ "node", "dist/application/api/main.js" ]
