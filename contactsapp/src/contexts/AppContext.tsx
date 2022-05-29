import React, {
  //createContext,
  useCallback,
  useMemo,
  useState,
  createContext
} from "react";

import { User } from '../types/User';

interface IAppContext {
  user: User | null;
  setState?: () => void; //User ?
  token: string;
  signin?: (token:string, user:User) => void;
  signout?: () => void;
}

//export const AppContext = createContext<IAppContext>({} as IAppContext);

const LOCAL_STORAGE_AUTH_KEY = "af-auth";

export const initialState = {
  token: null,
  user: null,
  setState: () => {}
};

const createContextValue = ({ token, user, setState }) => {
  return {
    token,
    user,
    signin: (token, user ) => setState({ token, user }),
    signout: () =>{
      setState({ token: null, user: null })
      localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY)
    }
  };
}


export const AppContext = createContext<IAppContext>(
  createContextValue({
    token: initialState.token, 
    user: initialState.user,
    // profile: initialState.profile,
    setState: () =>
      console.error("You are using AppContext without AppContextProvider!")
  })
);

export const AppContextProvider = ({ children }) => {
  const [state, setState] = usePersistedAuth(initialState);

  const contextValue = useMemo(() => {
    const { token, user} = state;
    return createContextValue({ token, user, setState });
  }, [state, setState]);

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}


function usePersistedAuth(defaultState) {
  const [state, setStateRaw] = useState(() => getStorageState(defaultState));

  const setState = useCallback(newState => {
    setStateRaw(newState);
    setStorageState(newState);
  }, []);

  return [state, setState];
}

function getStorageState(defaultState) {
  if (!window.localStorage) {
    return defaultState;
  }

  const rawData = window.localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
  if (!rawData) {
    return defaultState;
  }

  try {
    const { token, user } = JSON.parse(rawData);

    if (token && user) {
      return { token, user };
    }
  } catch (e) {}

  return defaultState;
}

function setStorageState(newState) {
  if (!window.localStorage) {
    return;
  }

  window.localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(newState));
}
