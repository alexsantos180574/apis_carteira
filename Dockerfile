FROM node:10-alpine

WORKDIR /usr/app

COPY package*.json ./

COPY ./dist .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]