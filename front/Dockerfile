FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
RUN npm install -g typescript

COPY . .

ENV HOST=0.0.0.0
ENV PORT=3000

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
