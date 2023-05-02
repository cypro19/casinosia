FROM node:16 as builder
WORKDIR /management-frontend
COPY package*.json ./
RUN npm i
COPY . ./
RUN npm run build

FROM node:16 as runner
WORKDIR /management-frontend
ENTRYPOINT ["npm", "start"]
EXPOSE 3000