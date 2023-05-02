FROM node:16 as builder
ARG ARG_REACT_APP_API_URL
ENV REACT_APP_API_URL=$ARG_REACT_APP_API_URL

WORKDIR /gs-admin-frontend
COPY package*.json ./
RUN npm i --legacy-peer-deps
COPY . ./
RUN npm run build
# aws-cdk docker build requirements


FROM node:16 as runner
WORKDIR /gs-admin-frontend
ENTRYPOINT ["npm", "run", "start"]
EXPOSE 3002