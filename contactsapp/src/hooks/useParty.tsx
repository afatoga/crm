import {  useMutation, useQuery  } from '@apollo/client'; /*makeVar,useLazyQuery*/

import {
    GET_ALL_PERSONS
} from '../api/party/queries';
import {
    CREATE_UPDATE_PERSON
} from '../api/party/mutations';


// export const reportsQueueVar = makeVar<string[]>([]);
// export const downloadActiveVar = makeVar<boolean>(false);

export function useParty() {


    const getAllPersons = useQuery(GET_ALL_PERSONS, {
    });

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
            getAllPersons,
            createUpdatePerson
        }
    }
}