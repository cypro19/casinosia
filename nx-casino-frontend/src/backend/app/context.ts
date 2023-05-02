import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { CognitoJwtVerifierSingleUserPool } from "aws-jwt-verify/cognito-verifier";
import { DataSource } from "typeorm";
import { CookieJar } from "../utils";

export type AppContext = {
  request: {
    headers: Headers;
    userId?: string;
  };
  response: {
    cookies: CookieJar;
  };
  cognito: {
    idpClient: CognitoIdentityProviderClient;
    isCognitoLocal: boolean;
    clientId: string;
    userPoolId: string;
    jwtVerifier: CognitoJwtVerifierSingleUserPool<{
      tokenUse: "id";
      userPoolId: string;
      clientId: string;
    }>;
  };
  database: {
    dbClient: DataSource;
  };
};
