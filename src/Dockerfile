# Define base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy source code
COPY . .

# Install dependencies
RUN npm install

# Expose porta 8080
EXPOSE 8080

# Comando para executar a aplicação quando o contêiner for iniciado
CMD ["node", "/app/server.js"]

