import {  useMutation, useLazyQuery, useQuery  } from '@apollo/client'; /*makeVar,useLazyQuery*/

import {
    //GET_ALL_PERSONS,
    GET_PERSONS_BY_APPUSERGROUP,
    GET_PERSON_BY_ID
} from '../api/party/queries';
import {
    GET_STATUS_LIST
} from '../api/status/queries';
import {
    CREATE_UPDATE_PERSON
} from '../api/party/mutations';


// export const reportsQueueVar = makeVar<string[]>([]);
// export const downloadActiveVar = makeVar<boolean>(false);

export function useParty() {


    //const getAllPersons = useLazyQuery(GET_ALL_PERSONS);

    const getPersonsByAppUserGroup = useLazyQuery(GET_PERSONS_BY_APPUSERGROUP);

    const getPersonById = useLazyQuery(GET_PERSON_BY_ID);

    const getStatusList = useLazyQuery(GET_STATUS_LIST);

    const createUpdatePerson = useMutation(CREATE_UPDATE_PERSON, {
        fetchPolicy: 'network-only',
         // onCompleted: (data) => {
        //     if (data.exportOverstockCsv.download_url) {
        //         downloadFileData({ name: 'InventoryOverview', url: data.exportOverstockCsv.download_url, type: 'text/csv' })
        //     }
        // },
    })



    return {
        operations: {
            // getAllPersons,
            getPersonsByAppUserGroup,
            getPersonById,
            getStatusList,
            createUpdatePerson
        }
    }
}