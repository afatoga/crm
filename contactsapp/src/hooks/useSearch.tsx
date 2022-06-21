import { useLazyQuery} from '@apollo/client'; /*makeVar,useLazyQuery,useApolloClient*/

import {
    GET_SEARCH_RESULTS
} from '../api/search/queries';


export function useSearch() {
    //const getAllTAGs = useLazyQuery(GET_ALL_TAGS);

    const getSearchResults = useLazyQuery(GET_SEARCH_RESULTS);


    return {
        operations: {
            getSearchResults
        }
    }
}