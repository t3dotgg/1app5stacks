import { ApolloClient, InMemoryCache } from "@apollo/client";

export const graphqlClient = new ApolloClient({
  uri: "https://roundest-go.fly.dev/graphql",
  cache: new InMemoryCache(),
});
