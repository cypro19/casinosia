import { CognitoJwtVerifier } from "aws-jwt-verify";
import config from "../../config/app";

export const jwtVerifier = CognitoJwtVerifier.create({
  tokenUse: "id",
  userPoolId: config.get("cognito.userPoolId"),
  clientId: config.get("cognito.clientId"),
});
