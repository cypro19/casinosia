import "reflect-metadata";
import { createApolloServer } from "@/backend/app/app";
import { getConfig } from "@/backend/app/config";
import { AppContext } from "@/backend/app/context";
import { getServices } from "@/backend/app/services";
import { startServerAndCreateNextHandler } from "../../../backend/nextjs-router";

const server = createApolloServer({
  mockSchema: false,
  plugins: [],
});

const graphqlHandler = startServerAndCreateNextHandler(server, {
  context: async (req, res, options): Promise<AppContext> => {
    const config = await getConfig();
    const services = await getServices(config);

    return {
      request: {
        headers: req.headers,
      },
      response: {
        cookies: options.resCookies,
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
  },
});

export async function GET(request: Request): Promise<Response> {
  return graphqlHandler(request);
}

export async function POST(request: Request): Promise<Response> {
  return graphqlHandler(request);
}
