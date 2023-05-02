import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:3000/api/graphql",
  documents: "src/**/*.graphql",
  generates: {
    "src/components/graphql/generated-client-api.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
    },
    "src/components/graphql/generated-server-api.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-generic-sdk",
      ],
    },
  },
};

export default config;
