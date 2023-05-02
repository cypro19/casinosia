import "reflect-metadata";
import * as secrets from "@aws-sdk/client-secrets-manager";
const awsServerlessExpress = require("aws-serverless-express");

const client = new secrets.SecretsManagerClient();
let expressHandler = null;

const initDbCredentials = async () => {
  const command = new secrets.GetSecretValueCommand({
    SecretId: process.env.DB_SECRET_NAME,
  });

  const response = await client.send(command);
  const secretJson = JSON.parse(response["SecretString"]);

  process.env.DB_PORT = secretJson.port;
  process.env.DB_USER = secretJson.username;
  process.env.DB_PASSWORD = secretJson.password;
  process.env.DB_HOST = secretJson.host;
};

const initOpenSearchCredentials = async () => {
  const command = new secrets.GetSecretValueCommand({
    SecretId: process.env.SEARCH_SECRET_NAME,
  });

  const response = await client.send(command);
  const secretJson = JSON.parse(response["SecretString"]);

  process.env.ELASTIC_URL = process.env.SEARCH_ENDPOINT;
  process.env.ELASTIC_USER = secretJson.username;
  process.env.ELASTIC_PASSWORD = secretJson.password;
};

const initEnvironment = async () => {
  if (!expressHandler) {
    await Promise.all([initDbCredentials(), initOpenSearchCredentials()]);
    const expressApp = require("./server/express").init();

    expressHandler = awsServerlessExpress.createServer(expressApp);
  }

  return expressHandler;
};

const handler = async (event, context) => {
  const expressHandler = await initEnvironment();

  const response = await awsServerlessExpress.proxy(
    expressHandler,
    event,
    context,
    "PROMISE"
  );

  return response.promise;
};

module.exports = {
  handler: handler,
};
