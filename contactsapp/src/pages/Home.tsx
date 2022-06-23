import { styled, Typography } from '@mui/material';
import { useContext } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import logo from '../logo.svg';

import { AppContext } from '../contexts';
import { APP_TITLE, PAGE_TITLE_HOME } from '../utils/constants';
import { useTranslation } from 'react-i18next';

export const Home = () => {
  const context = useContext(AppContext);
  const {t} = useTranslation();


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
      <Typography variant="h4">{`${t('general.welcome')}, ${context.user?.email} 🎃`}</Typography>
      <LogoWrapper>
        <StyledLogo src={logo} alt="logo" />
      </LogoWrapper>
      </> : <>
      <Typography textAlign={'center'} fontSize={'3rem'} margin={'1rem 0'}>
        {t('general.welcomeTo') + ` ` + t('pageTitles.contactsApp')}
      </Typography>
      <Typography textAlign={'center'} fontSize={'1.6rem'} margin={'1rem 0'}>
        <br />{t('general.appIntro')}
        
      </Typography>

      <Typography textAlign={'center'} fontSize={'1.2rem'}>{t('general.continueTo')} <Link to={"/login"}>Login</Link> {t('general.page')}.</Typography>

      <Typography textAlign={'center'} margin={'1rem 0'}>{t('general.appWrittenInTypeScript')}</Typography>
   
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
