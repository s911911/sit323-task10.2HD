FROM node:18
WORKDIR /app
COPY simulate.mjs .
RUN npm install node-fetch
CMD ["node", "simulate.mjs"]
