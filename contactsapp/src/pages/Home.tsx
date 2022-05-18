import { styled, Typography } from '@mui/material';
import { useContext } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import logo from '../logo.svg';

import { AppContext } from '../contexts';
import { APP_TITLE, PAGE_TITLE_HOME } from '../utils/constants';

export const Home = () => {
  const context = useContext(AppContext);

  console.log('homepageContext:', context);

  return (
    <>
    <HelmetProvider>
      <Helmet>
        <title>
          {PAGE_TITLE_HOME} | {APP_TITLE}
        </title>
      </Helmet>
      </HelmetProvider>
      {context.user ? 
      <>
      <Typography variant="h4">{`Hello, ${context.user?.email} 🎃`}</Typography>
      <LogoWrapper>
        <StyledLogo src={logo} alt="logo" />
      </LogoWrapper>
      </> : <>
      <Typography textAlign={'center'} fontSize={'3rem'} margin={'1rem 0'}>
        Welcome to ContactsApp.
      </Typography>
      <Typography textAlign={'center'} fontSize={'1.6rem'} margin={'1rem 0'}>
        <br />It's made for storing and browsing both personal and organizational profiles.
        
      </Typography>

      <Typography textAlign={'center'} fontSize={'1.2rem'}>Continue to <Link to={"/login"}>Login</Link> or <Link to={"/register"}>Register</Link> pages.</Typography>

      <Typography textAlign={'center'} margin={'1rem 0'}>This app is written in TypeScript.</Typography>
   
      </>}
      
 

     
    </>
  );
};

const LogoWrapper = styled('div')`
  text-align: center;
  margin-top: 6rem;
`;

const StyledLogo = styled('img')`
  height: 40vmin;
  pointer-events: none;
  @media (prefers-reduced-motion: no-preference) {
    animation: App-logo-spin infinite 15s linear;
  }
  @keyframes App-logo-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
