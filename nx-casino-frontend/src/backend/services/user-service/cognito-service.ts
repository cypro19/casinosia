import {
  AdminInitiateAuthCommand,
  AdminCreateUserCommand,
  UserType,
  SignUpCommand,
  ConfirmSignUpCommand,
  AdminSetUserPasswordCommand,
  AdminGetUserCommand,
  AdminGetUserResponse,
} from "@aws-sdk/client-cognito-identity-provider";
import jwtDecode from "jwt-decode";

import { AppContext } from "../../app/context";
import {
  ConfirmRegistrationInput,
  UserPasswordLogin,
  UserRefreshTokenLogin,
  UserRegistrationForm,
} from "../../resolvers/user/input-types";
import {
  UserLoginCredentials,
  UserRefreshCredentials,
} from "../../resolvers/user/output-types";

enum AuthFlow {
  AdminUserPasswordAuth = "ADMIN_USER_PASSWORD_AUTH",
  RefreshTokenAuth = "REFRESH_TOKEN_AUTH",
}

export namespace CognitoService {
  // TODO: SPR (Secure Password Protocol) in future
  export const loginWithPassword = async (
    context: AppContext,
    loginCredentials: UserPasswordLogin
  ): Promise<UserLoginCredentials> => {
    const loginCmd = new AdminInitiateAuthCommand({
      UserPoolId: context.cognito.userPoolId,
      ClientId: context.cognito.clientId,
      AuthFlow: AuthFlow.AdminUserPasswordAuth,
      AuthParameters: {
        USERNAME: loginCredentials.username,
        PASSWORD: loginCredentials.password,
      },
    });
    const response = await context.cognito.idpClient.send(loginCmd);

    if (!response.AuthenticationResult) {
      throw new Error("Failed to do authentication");
    }

    return {
      idToken: response.AuthenticationResult.IdToken!,
      refreshToken: response.AuthenticationResult.RefreshToken!,
      expiresIn: response.AuthenticationResult.ExpiresIn!,
      accessToken: response.AuthenticationResult.AccessToken!,
      userId: getTokenAttribute(
        response.AuthenticationResult.AccessToken!,
        "sub"
      ),
    };
  };

  export const loginWithRefreshToken = async (
    context: AppContext,
    loginCredentials: UserRefreshTokenLogin
  ): Promise<UserRefreshCredentials> => {
    const loginCmd = new AdminInitiateAuthCommand({
      UserPoolId: context.cognito.userPoolId,
      ClientId: context.cognito.clientId,
      AuthFlow: AuthFlow.RefreshTokenAuth,
      AuthParameters: {
        REFRESH_TOKEN: loginCredentials.refreshToken,
      },
    });

    const response = await context.cognito.idpClient.send(loginCmd);

    if (!response.AuthenticationResult) {
      throw new Error("Failed to do authentication");
    }

    return {
      idToken: response.AuthenticationResult.IdToken!,
      expiresIn: response.AuthenticationResult.ExpiresIn!,
      accessToken: response.AuthenticationResult.AccessToken!,
      userId: getTokenAttribute(
        response.AuthenticationResult.AccessToken!,
        "sub"
      ),
    };
  };

  export const signUpCognitoUser = async (
    context: AppContext,
    regForm: UserRegistrationForm
  ) => {
    const signUpCmd = new SignUpCommand({
      Password: regForm.password,
      ClientId: context.cognito.clientId,
      Username: regForm.email,
      UserAttributes: [
        {
          Name: "email",
          Value: regForm.email,
        },
      ],
    });

    const response = await context.cognito.idpClient.send(signUpCmd);

    if (!response.UserSub) {
      throw new Error("User subject is not present");
    }

    return {
      userId: response.UserSub,
    };
  };

  export const confirmCognitoUser = async (
    context: AppContext,
    input: ConfirmRegistrationInput
  ): Promise<UserType> => {
    const confirmCmd = new ConfirmSignUpCommand({
      ClientId: context.cognito.clientId,
      ConfirmationCode: input.code,
      Username: input.username,
    });

    const [gotUser] = await Promise.all<
      [Promise<AdminGetUserResponse>, unknown]
    >([
      findUserByUsername(context, input.username),
      context.cognito.idpClient.send(confirmCmd),
    ]);

    return {
      ...gotUser,
      Attributes: gotUser.UserAttributes,
    };
  };

  export const createCognitoUser = async (
    context: AppContext,
    regForm: UserRegistrationForm
  ): Promise<UserType> => {
    const createUserCmd = new AdminCreateUserCommand({
      Username: regForm.email,
      UserPoolId: context.cognito.userPoolId,
      TemporaryPassword: regForm.password,
      // TODO: a bug in cognito-local that require delivery medium
      DesiredDeliveryMediums: context.cognito.isCognitoLocal
        ? ["EMAIL"]
        : undefined,
      UserAttributes: [
        {
          Name: "email",
          Value: regForm.email,
        },
      ],
    });

    const setUserPassword = new AdminSetUserPasswordCommand({
      Password: regForm.password,
      UserPoolId: context.cognito.userPoolId,
      Username: regForm.email,
      Permanent: true,
    });

    const cognitoUser = await context.cognito.idpClient.send(createUserCmd);

    if (!cognitoUser.User) {
      throw new Error("Failed to create user");
    }

    await context.cognito.idpClient.send(setUserPassword);

    return cognitoUser.User;
  };

  export const getCognitoUserAttribute = (
    user: UserType,
    attrName: string
  ): string => {
    const userSubAttr = user.Attributes?.find((attr) => {
      return attr.Name === "sub";
    });

    if (!userSubAttr || !userSubAttr.Value) {
      throw new Error(`Failed to get user attribute ${attrName}`);
    }

    return userSubAttr.Value;
  };

  export const getTokenAttribute = (token: string, attrName: "sub"): string => {
    return jwtDecode<{ sub: string }>(token)[attrName];
  };

  export const findUserByUsername = async (
    context: AppContext,
    username: string
  ): Promise<AdminGetUserResponse> => {
    const getCmd = new AdminGetUserCommand({
      Username: username,
      UserPoolId: context.cognito.userPoolId,
    });

    return context.cognito.idpClient.send(getCmd);
  };
}
