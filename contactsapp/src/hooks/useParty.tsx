import {  useQuery  } from '@apollo/client';/*makeVar,useLazyQuery*/

import {
    GET_ALL_PERSONS
} from '../api/party/queries';

//import { downloadFileData } from '../api/v3/Pages/Exports/utilityFunctions';

// export const reportsQueueVar = makeVar<string[]>([]);
// export const downloadActiveVar = makeVar<boolean>(false);

export function useParty() {


    const getAllPersons = useQuery(GET_ALL_PERSONS, {
        context: { userInstance: true },
    });

    // const getOverstockExportCSV = useLazyQuery(GET_EXPORT_OVERSTOCK_CSV, {
    //     context: { userInstance: true },
    //     fetchPolicy: 'network-only',
        // onCompleted: (data) => {
        //     if (data.exportOverstockCsv.download_url) {
        //         downloadFileData({ name: 'InventoryOverview', url: data.exportOverstockCsv.download_url, type: 'text/csv' })
        //     }
        // },
    // });


    return {
        operations: {
            getAllPersons
        }
    }
}