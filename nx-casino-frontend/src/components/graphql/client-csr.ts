import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { useMemo } from "react";

const createApolloClient = (): ApolloClient<NormalizedCacheObject> => {
  return new ApolloClient({
    ssrMode: true,
    uri: "/api/graphql",
    cache: new InMemoryCache(),
    connectToDevTools: false,
  });
};

// client side rendering
export function useApollo() {
  const client = useMemo(() => createApolloClient(), []);
  return client;
}
