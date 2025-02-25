FROM node:23-alpine
WORKDIR /app
COPY . .
RUN nmp install
EXPOSE 8080
CMD ["node", "/app/server.js"]
