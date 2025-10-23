import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client/react";
import client from "@/graphql/apolloClient";
import ErrorBoundary from "@/components/ErrorBoundary";


export default function App({ Component, pageProps }: AppProps) {
  return (
    // <ApolloProvider client={client}>
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    // </ApolloProvider>
  );
}
