FROM node:12
WORKDIR app/
COPY package*.json /app
RUN npm install
RUN npm ci --only=production
COPY . /app
RUN npm run build
EXPOSE 3000
CMD [ "cross-env", "NODE_ENV=production", "node", "server/index.js" ]
