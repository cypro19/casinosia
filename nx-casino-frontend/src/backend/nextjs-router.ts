import {
  ApolloServer,
  BaseContext,
  ContextFunction,
  HeaderMap,
} from "@apollo/server";
import { parse } from "url";
import { CookieJar, createCookieJar } from "./utils";

type NextHandlerOptions = {
  resCookies: CookieJar;
};

export type NextHandler = (
  req: Request,
  res: Response,
  options: NextHandlerOptions
) => void;

interface Options<Context extends BaseContext> {
  context?: ContextFunction<Parameters<NextHandler>, Context>;
}

const defaultContext: ContextFunction<[], any> = async () => ({});

function startServerAndCreateNextHandler<Context extends BaseContext>(
  server: ApolloServer<Context>,
  options?: Options<Context>
) {
  server.startInBackgroundHandlingStartupErrorsByLoggingAndFailingAllRequests();

  const contextFunction = options?.context || defaultContext;

  const handler = async (req: Request): Promise<Response> => {
    const headers = new HeaderMap();

    for (const [key, value] of req.headers.entries()) {
      if (typeof value === "string") {
        headers.set(key, value);
      }
    }

    const body =
      headers.get("content-type") === "application/json"
        ? await req.json()
        : await req.text();

    const resCookies = createCookieJar();

    const httpGraphQLResponse = await server.executeHTTPGraphQLRequest({
      context: () =>
        contextFunction(req, new Response(), {
          resCookies,
        }),
      httpGraphQLRequest: {
        body: body,
        headers,
        method: req.method || "POST",
        search: req.url ? parse(req.url).search || "" : "",
      },
    });

    const data: string[] = [];

    if (httpGraphQLResponse.body.kind === "complete") {
      data.push(httpGraphQLResponse.body.string);
    } else {
      for await (const chunk of httpGraphQLResponse.body.asyncIterator) {
        data.push(chunk);
      }
    }

    const responseHeaders: [string, string][] = [
      ...Array.from(httpGraphQLResponse.headers).map<[string, string]>(
        ([key, value]) => {
          return [key, value];
        }
      ),
      // A bug of setting multiple cookies at the same time in next.js
      // this is for local development
      ...resCookies.getSetCookieHeaders().map<[string, string]>((cookie) => {
        return ["Set-Cookie", cookie];
      }),
    ];

    // custom way to set headers for aws lambda
    (global as any).overrideCookies = resCookies.getSetCookieHeaders();

    const response = new Response(data.join(""), {
      status: httpGraphQLResponse.status || 200,
      headers: responseHeaders,
    });

    return response;
  };

  return handler;
}

export { startServerAndCreateNextHandler };
