FROM node:16 as builder
WORKDIR /gs-admin-backend
COPY package*.json ./
# they have dependency conflicts
RUN npm i --legacy-peer-deps
COPY . ./
RUN npm run build
RUN cp -r node_modules dist/node_modules


FROM node:16 as runner
USER node
COPY --chown=node:node . /gs-admin-backend

WORKDIR /gs-admin-backend
ENTRYPOINT [ "npm", "run", "watch:docker" ]
EXPOSE 4000
