import "server-only";

import { cookies } from "next/headers";
import { createClientSSR } from "./client-ssr";

export type Auth = {
  status: "authenticated";
  userId: string;
  accessToken: string;
};

export type NotAuth = {
  status: "unauthenticated";
};

const client = createClientSSR();

export const getAuthSession = async (): Promise<Auth | NotAuth> => {
  const refreshToken = cookies().get("x-refresh-token")?.value || "";
  const accessToken = cookies().get("x-access-token")?.value || "";

  if (accessToken) {
    const authResponse = await tryToAuthenticate(accessToken);

    // perhaps expired access token
    if (authResponse.status === "authenticated") {
      return authResponse;
    }
  }

  // long lived token used for login
  if (refreshToken) {
    return await tryToLogin(refreshToken);
  }

  return {
    status: "unauthenticated",
  };
};

const tryToAuthenticate = async (
  accessToken: string
): Promise<Auth | NotAuth> => {
  try {
    const response = await client.getUser();
    return {
      accessToken: accessToken,
      status: "authenticated",
      userId: response.user.userId,
    };
  } catch {
    return {
      status: "unauthenticated",
    };
  }
};

const tryToLogin = async (refreshToken: string): Promise<Auth | NotAuth> => {
  try {
    const response = await client.loginWithRefreshToken({
      input: {
        refreshToken: refreshToken,
      },
    });
    return {
      accessToken: refreshToken,
      status: "authenticated",
      userId: response.loginWithRefreshToken.userId,
    };
  } catch {
    return {
      status: "unauthenticated",
    };
  }
};
