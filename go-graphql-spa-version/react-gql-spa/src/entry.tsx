import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "./router.tsx";
import { ApolloProvider } from "@apollo/client";
import { graphqlClient } from "./utils/apollo/client.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={graphqlClient}>
      <AppRouter />
    </ApolloProvider>
  </StrictMode>
);
