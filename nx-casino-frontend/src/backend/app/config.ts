import dotenv from "dotenv";
import * as secrets from "@aws-sdk/client-secrets-manager";
import { noArgsMemoize } from "../utils";

dotenv.config();

export type Config = Awaited<ReturnType<typeof _getConfig>>;

const _getConfig = async () => {
  if (process.env.DB_SECRET_NAME) {
    const command = new secrets.GetSecretValueCommand({
      SecretId: process.env.DB_SECRET_NAME,
    });

    const client = new secrets.SecretsManagerClient({});
    const response = await client.send(command);
    const secretJson = JSON.parse(response["SecretString"]!);

    process.env.DATABASE_PORT = secretJson.port;
    process.env.DATABASE_USERNAME = secretJson.username;
    process.env.DATABASE_PASSWORD = secretJson.password;
    process.env.DATABASE_HOST = secretJson.host;
  }

  return {
    cognito: {
      // TODO: we specify cognito local endpoint, but we might specify concrete cognito endpoint
      isCognitoLocal: !!process.env.COGNITO_ENDPOINT,
      clientId: process.env.COGNITO_CLIENT_ID!,
      userPoolId: process.env.COGNITO_USER_POOL_ID!,
      region: process.env.COGNITO_REGION!,
      endpoint: process.env.COGNITO_ENDPOINT,
    },
    database: {
      username: process.env.DATABASE_USERNAME!,
      password: process.env.DATABASE_PASSWORD!,
      port: Number(process.env.DATABASE_PORT!),
      dbName: process.env.DATABASE_NAME!,
      host: process.env.DATABASE_HOST!,
    },
  };
};

export const getConfig = noArgsMemoize(_getConfig);
