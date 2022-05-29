import {  useMutation, useLazyQuery, useQuery  } from '@apollo/client'; /*makeVar,useLazyQuery*/

import {
    GET_PARTYRELATIONSHIPS,
    //GET_ALL_PERSONS,
    GET_PERSONS_BY_APPUSERGROUP,
    GET_PERSON_BY_ID
} from '../api/party/queries';
import {
    GET_STATUS_LIST
} from '../api/status/queries';
import {
    CREATE_UPDATE_PERSON,
    CREATE_PARTYRELATIONSHIP,
    // UPDATE_PARTYRELATIONSHIP,
    DELETE_PARTYRELATIONSHIP
} from '../api/party/mutations';


// export const reportsQueueVar = makeVar<string[]>([]);
// export const downloadActiveVar = makeVar<boolean>(false);

export function useParty() {


    //const getAllPersons = useLazyQuery(GET_ALL_PERSONS);

    const getPersonsByAppUserGroup = useLazyQuery(GET_PERSONS_BY_APPUSERGROUP);
    // const getParties = useLazyQuery(GET_PARTIES);

    const getPersonById = useLazyQuery(GET_PERSON_BY_ID);

    const getStatusList = useLazyQuery(GET_STATUS_LIST);

    const getPartyRelationships = useLazyQuery(GET_PARTYRELATIONSHIPS)

    const createUpdatePerson = useMutation(CREATE_UPDATE_PERSON, {
        fetchPolicy: 'network-only',
    })
    const createPartyRelationship = useMutation(CREATE_PARTYRELATIONSHIP, {
        fetchPolicy: 'network-only',
    })
    const deletePartyRelationship = useMutation(DELETE_PARTYRELATIONSHIP, {
        fetchPolicy: 'network-only',
    })



    return {
        operations: {
            // getAllPersons,
            getPersonsByAppUserGroup,
            getPersonById,
            getStatusList,
            getPartyRelationships,
            createUpdatePerson,
            createPartyRelationship,
            deletePartyRelationship
        }
    }
}