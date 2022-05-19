import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  //useQuery,
  //gql
} from "@apollo/client";

import { setContext } from '@apollo/client/link/context';

import App from './App';

//import reportWebVitals from './reportWebVitals';
import { APP_TITLE, APP_DESCRIPTION } from './utils/constants';


const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
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

const client = new ApolloClient({
  link: authLink.concat(httpLink),
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
