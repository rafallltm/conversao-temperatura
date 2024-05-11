# Use uma versão específica da imagem base para o estágio de construção
FROM node:14-alpine AS builder

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos de dependências e instale as dependências
COPY package.json package-lock.json ./
RUN npm ci --quiet --only=production && \
    npm cache clean --force

# Copie o restante do código-fonte
COPY . .

# Compile seu aplicativo, se necessário
RUN npm run build

# Etapa de construção final
FROM node:14-alpine

# Defina um usuário não-root
USER node

WORKDIR /app

# Copie os arquivos necessários do estágio de compilação
COPY --from=builder /app ./

# Exponha a porta do seu aplicativo
EXPOSE 8080

# Comando para iniciar o aplicativo
CMD ["node", "/app/server.js"]
