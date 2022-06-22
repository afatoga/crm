import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import './i18n';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  //useQuery,
  //gql
} from "@apollo/client";
import { useNavigate } from 'react-router-dom';

import { setContext } from '@apollo/client/link/context';
import { onError } from "@apollo/client/link/error";

import App from './App';

//import reportWebVitals from './reportWebVitals';
import { APP_TITLE, APP_DESCRIPTION } from './utils/constants';


const httpLink = createHttpLink({
  uri: process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : 'http://localhost:4000',
  //credentials: 'same-origin' //credentials: 'include' if your backend is a different domain.
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  let accessToken = null;
  const currentAuth = localStorage.getItem('af-auth');
  if (currentAuth) {
    const {token} = JSON.parse(currentAuth);
    accessToken = token;
  }
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    }
  }
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) => {
      if (message === 'Context creation failed: Authorization is invalid') {
        //logout
        localStorage.clear();
        //(window as any).location.href = '/login';
      }

      // console.log(
      //   `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      // )
    }
      
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  link: errorLink.concat(authLink.concat(httpLink)),
  cache: new InMemoryCache()
});

// const client = new ApolloClient({
//   cache: new InMemoryCache(),
//   link,
// });

ReactDOM.render(
  <React.StrictMode>
    <HelmetProvider >
    <Helmet>
      <title>{APP_TITLE}</title>
      <meta name="description" content={APP_DESCRIPTION} />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      <meta name="viewport" content="initial-scale=1, width=device-width" />
    </Helmet>
    <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
  </HelmetProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

//reportWebVitals(console.log);
