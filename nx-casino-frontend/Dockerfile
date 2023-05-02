FROM node:16 as builder
WORKDIR /nx-casino-frontend
COPY package*.json ./
RUN npm i
COPY . ./
RUN npm run build-open-next

FROM node:16 as open-next-static-assets
WORKDIR /static-assets
COPY --from=builder /nx-casino-frontend/.open-next/assets .

FROM node:16 as open-next-image-optimization-function
WORKDIR /image-optimization-function
COPY --from=builder /nx-casino-frontend/.open-next/image-optimization-function .

FROM node:16 as open-next-server-lambda
WORKDIR /server-function
COPY --from=builder /nx-casino-frontend/.open-next/server-function .

FROM node:16 as runner
USER node
WORKDIR /nx-casino-frontend
ENTRYPOINT ["npm", "start"]
EXPOSE 3000