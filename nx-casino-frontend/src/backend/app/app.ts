import "reflect-metadata";
import { buildSchemaSync } from "type-graphql";
import { ApolloServer, ApolloServerPlugin } from "@apollo/server";
import { Json, JsonScalarGraphQL } from "../scalars/json-scalar";
import { addMocksToSchema } from "@graphql-tools/mock";
import { GameResolver } from "../resolvers/game/game";
import { StatisticsResolver } from "../resolvers/statistics/statistics";
import { GraphResolver } from "../resolvers/time-series/time-series";
import { PlayerResolver } from "../resolvers/player/player";
import { PlayerTagResolver } from "../resolvers/player-tag/player-tag";
import { UserResolver } from "../resolvers/user/user";

export type AppConfig = {
  plugins?: ApolloServerPlugin[];
  mockSchema: boolean;
};

export const createApolloServer = (config: AppConfig): ApolloServer => {
  let schema = buildSchemaSync({
    validate: false,
    dateScalarMode: "isoDate",
    resolvers: [
      PlayerResolver,
      PlayerTagResolver,
      GameResolver,
      GraphResolver,
      StatisticsResolver,
      UserResolver,
    ],
    scalarsMap: [
      {
        type: Json,
        scalar: JsonScalarGraphQL,
      },
    ],
  });

  if (config.mockSchema) {
    schema = addMocksToSchema({
      schema: schema,
      mocks: {
        DateTime: () => new Date(),
      },
    });
  }

  return new ApolloServer({
    schema: schema,
    introspection: true,
    plugins: config.plugins,
  });
};
