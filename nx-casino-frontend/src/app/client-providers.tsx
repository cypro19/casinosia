"use client";

import { useApollo } from "@/components/graphql/client-csr";
import { ApolloProvider } from "@apollo/client";

export const ClientProviders = (props: { children: React.ReactNode }) => {
  const client = useApollo();

  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
};
