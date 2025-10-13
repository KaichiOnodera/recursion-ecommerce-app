FROM node:18

WORKDIR /app

COPY package*.json ./

# tsx は不要、本番構成でOK
RUN npm install

RUN npm install -g typescript

COPY . .

# TypeScriptをビルド
RUN npm run build
RUN npm install -g tsx

EXPOSE 3000

# dist から起動
CMD ["npm", "start"]
