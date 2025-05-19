FROM node:18

WORKDIR /usr/src/app

COPY backend/ ./     
COPY public ./public 
COPY firebase.json ./firebase.json

RUN npm install

EXPOSE 8080

CMD ["npm", "start"]
