FROM node:23-alpine
WORKDIR /app
COPY package*.json .
RUN npm ci --only=production
COPY . .
USER node
EXPOSE 8080
CMD ["node", "server.js"]
