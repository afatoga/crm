import {
  makeVar,
  useLazyQuery,
  useApolloClient,
} from "@apollo/client"; /*makeVar,useLazyQuery,useApolloClient*/
import { useLocation, useNavigate } from "react-router-dom";

import { GET_SEARCH_RESULTS } from "../api/search/queries";

export const searchedTextVar = makeVar<string>("");
export const foundResultsVar = makeVar<any[]>([]);
export function useSearch() {
  //const getAllTAGs = useLazyQuery(GET_ALL_TAGS);
  // const client = useApolloClient();
  const location = useLocation();
  const navigate = useNavigate();

  const getSearchResults = useLazyQuery(GET_SEARCH_RESULTS, {
    //fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data?.searchResults.status === "SUCCESS") {
        foundResultsVar(data.searchResults.results);

        if (location.pathname !== "/search") {
          navigate("/search");
        }
      }
    },
  });

  // const getSearchResultsFromCache = (variables: {appUserGroupId: number, searchedText: string}) => {
  //     const data = client.readQuery({
  //         query: GET_SEARCH_RESULTS,
  //         variables: variables
  //     });

  //     //if (!data?.searchResults || !data.searchResults.length) return {data: null};

  //     return data;
  // }

  return {
    operations: {
      getSearchResults,
      //getSearchResultsFromCache
    },
  };
}
