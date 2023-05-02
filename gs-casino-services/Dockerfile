FROM node:16 as builder
WORKDIR /gs-casino-services
COPY package*.json ./
# they have dependency conflicts
RUN npm i
COPY . ./
RUN npm run build
RUN cp -r node_modules dist/node_modules


FROM node:16 as runner
USER node
COPY --chown=node:node . /gs-casino-services

WORKDIR /gs-casino-services
ENTRYPOINT [ "npm", "run", "watch:docker" ]
EXPOSE 5500
