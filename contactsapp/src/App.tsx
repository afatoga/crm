import { useMemo, useState, ReactNode } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { Layout } from './components/Layout';
import { PageDefault } from './components/PageDefault';

import { ThemeModeContext } from './contexts';
import { AppContextProvider } from './contexts/AppContext';
import { ModalProvider } from './contexts/ModalContext';
//import { AppClient } from './clients';
import { routes } from './config';
import { Route as AppRoute } from './types';
import { getAppTheme } from './styles/theme';
import { DARK_MODE_THEME, LIGHT_MODE_THEME } from './utils/constants';
import ProtectedRoute from './components/Router/ProtectedRoute';
import PublicRoute from './components/Router/PublicRoute';
// import { makeVar } from '@apollo/client';


function App() {
  const [mode, setMode] = useState<typeof LIGHT_MODE_THEME | typeof DARK_MODE_THEME>(DARK_MODE_THEME);
  // const appClient = new AppClient();
  // console.log('client:',appClient);

  const themeMode = useMemo(
    () => ({
      toggleThemeMode: () => {
        setMode((prevMode) => (prevMode === LIGHT_MODE_THEME ? DARK_MODE_THEME : LIGHT_MODE_THEME));
      },
    }),
    []
  );

  const theme = useMemo(() => getAppTheme(mode), [mode]);

  const getRouteNode = (route:AppRoute):ReactNode => {

    if (route.isProtected) return <ProtectedRoute isAdmin={!!route?.isAdmin}>{route.component ? <route.component /> : <PageDefault />}</ProtectedRoute>
    return <PublicRoute>{route.component ? <route.component /> : <PageDefault />}</PublicRoute>
  } 

  const addRoute = (route: AppRoute) => {
    //if(route.isProtected) return 
    return <Route key={route.key} path={route.path} element={getRouteNode(route)} />
  };

  return (
    <AppContextProvider>
      <ModalProvider>
      <ThemeModeContext.Provider value={themeMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Routes>
                <Route path="/" element={<Layout />} >
                {routes.map((route: AppRoute) =>
                  route.subRoutes ? route.subRoutes.map((item: AppRoute) => addRoute(item)) : addRoute(route)
                )}
                </ Route>
              
            </Routes>
          </Router>
        </ThemeProvider>
      </ThemeModeContext.Provider>
      </ModalProvider>
    </AppContextProvider>
  );
}

export default App;
