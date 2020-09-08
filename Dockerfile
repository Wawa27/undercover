FROM node:12
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node
RUN npm install
COPY --chown=node:node . .
RUN npm run build
EXPOSE 80
CMD [ "cross-env", "NODE_ENV=production", "node", "server/index.js" ]
