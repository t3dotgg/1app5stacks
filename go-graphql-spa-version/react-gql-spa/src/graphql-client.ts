import { ApolloClient, InMemoryCache } from "@apollo/client";

export const graphqlClient = new ApolloClient({
  uri: "https://flyby-router-demo.herokuapp.com/",
  cache: new InMemoryCache(),
});
