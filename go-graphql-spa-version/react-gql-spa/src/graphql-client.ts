import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

export const graphqlClient = new ApolloClient({
  uri: "https://roundest-go.fly.dev/graphql",
  cache: new InMemoryCache(),
});

export const getPokemon = async () => {
  return await graphqlClient.query({
    query: gql`
      query Pokemon {
        pokemon {
          name
          id
          upVotes
          downVotes
        }
      }
    `,
  });
};
