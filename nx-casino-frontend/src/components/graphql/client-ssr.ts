import "server-only";
import { createApolloServer } from "@/backend/app/app";
import { getConfig } from "@/backend/app/config";
import { AppContext } from "@/backend/app/context";
import { getServices } from "@/backend/app/services";
import { createCookieJar } from "@/backend/utils";
import { DocumentNode } from "graphql";
import { getSdk, Sdk } from "./generated-server-api";
import { headers } from "next/headers";

let sdk: Sdk | undefined;

export const createClientSSR = (): Sdk => {
  if (sdk) {
    return sdk;
  }

  const server = createApolloServer({
    mockSchema: false,
    plugins: [],
  });

  const requester = async <R, V>(doc: DocumentNode, vars?: V): Promise<R> => {
    const config = await getConfig();
    const services = await getServices(config);

    const resCookies = createCookieJar();

    const appContext: AppContext = {
      request: {
        headers: headers(),
      },
      response: {
        cookies: resCookies,
      },
      cognito: {
        clientId: config.cognito.clientId,
        isCognitoLocal: config.cognito.isCognitoLocal,
        userPoolId: config.cognito.userPoolId,
        idpClient: services.idpClient,
        jwtVerifier: services.jwtVerifier,
      },
      database: {
        dbClient: services.dbClient,
      },
    };

    const response = await server.executeOperation(
      {
        query: doc,
        variables: vars || undefined,
      },
      {
        contextValue: appContext,
      }
    );

    // TODO: currently appDir does not give access to response/request object therefore we cannot set cookie
    // Maybe add them using open-next

    // next.js server side rendering requires it to be object cannot be instance of something
    let nResponse = JSON.parse(JSON.stringify(response));

    if (nResponse.body.kind === "single") {
      if (nResponse.body.singleResult.errors) {
        console.log(nResponse.body.singleResult.errors);
        throw new Error("SSR received error from backend");
      }

      return nResponse.body.singleResult.data;
    }

    return nResponse.body.subsequentResults;
  };

  sdk = getSdk(requester);

  return sdk;
};
