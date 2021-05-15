import React from "react";
import {
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  ApolloClient,
} from "@apollo/client";
import { setContext } from "apollo-link-context";

import App from "./App";

const authLink = setContext(() => {
  const token = localStorage.getItem("jwtToken");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const httpLink = createHttpLink({
  uri: "http://localhost:5000",
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
