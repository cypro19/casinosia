import { GraphQLScalarType, Kind } from "graphql";

export class Json {}

export const JsonScalarGraphQL = new GraphQLScalarType({
  name: "JSON",
  description: "JSON object which is not stringified",
  serialize(value: unknown): string {
    JSON.parse(JSON.stringify(value));
    return value as string;
  },
  parseValue(value: unknown): string {
    return JSON.parse(JSON.stringify(value));
  },
  parseLiteral(ast): string {
    if (ast.kind !== Kind.STRING) {
      throw new Error("Scalar can only parse string values");
    }

    JSON.parse(ast.value);
    return ast.value;
  },
});
 