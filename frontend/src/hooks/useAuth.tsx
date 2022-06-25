import {useContext} from 'react';
import { AppContext } from '../contexts';

export const useAuth = () => {
    return useContext(AppContext);
}
  
