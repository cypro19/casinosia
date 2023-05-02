import "reflect-metadata";
import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { DataSource } from "typeorm";
import { CognitoJwtVerifierSingleUserPool } from "aws-jwt-verify/cognito-verifier";
import { UserEntity } from "../models/user-entity";
import { Config } from "./config";
import { noArgsMemoize } from "../utils";

type Services = {
  idpClient: CognitoIdentityProviderClient;
  jwtVerifier: CognitoJwtVerifierSingleUserPool<{
    tokenUse: "id";
    userPoolId: string;
    clientId: string;
  }>;
  dbClient: DataSource;
};

const _getServices = async (config: Config): Promise<Services> => {
  const [dbClient, idpClient, jwtVerifier] = await Promise.all([
    initDatabase(config),
    initCognito(config),
    initCognitoVerifier(config),
  ]);

  return {
    idpClient: idpClient,
    jwtVerifier: jwtVerifier,
    dbClient: dbClient,
  };
};

export const getServices = noArgsMemoize(_getServices);

const initDatabase = async (config: Config) => {
  const dataSource = new DataSource({
    type: "postgres",
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.dbName,
    synchronize: false,
    logging: true,
    entities: [UserEntity],
    subscribers: [],
    migrations: [],
  });

  await dataSource.initialize();

  return dataSource;
};

const initCognito = (config: Config) => {
  return new CognitoIdentityProviderClient({
    region: config.cognito.region,
    endpoint: config.cognito.endpoint,
  });
};

const initCognitoVerifier = async (config: Config) => {
  const jwtVerifier = CognitoJwtVerifier.create({
    tokenUse: "id",
    userPoolId: config.cognito.userPoolId,
    clientId: config.cognito.clientId,
  });

  await jwtVerifier.hydrate();

  return jwtVerifier;
};
