import { createMethodDecorator } from "type-graphql";
import * as Context from "../app/context";

export function PlayerAuthorized() {
  return createMethodDecorator<Context.AppContext>(
    async ({ context }, next) => {
      const verifier = context.cognito.jwtVerifier;

      let token = context.request.headers.get("authorization");

      if (!token) {
        throw new Error("User must be authenticated");
      }

      try {
        const data = await verifier.verify(token);
        context.request.userId = data.sub;

      } catch (err) {
        throw new Error("User credentials are not valid");
      }

      return next();
    }
  );
}
