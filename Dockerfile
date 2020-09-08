FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD [ "cross-env", "NODE_ENV=production", "node", "server/index.js" ]
