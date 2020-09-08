FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm ci --only=production
RUN npm run build
COPY . .
EXPOSE 80
CMD [ "node", "server/index.js" ]
