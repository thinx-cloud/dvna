FROM node:current-alpine

EXPOSE 5000

ENV port 5000

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

CMD [ "npm", "start" ]

