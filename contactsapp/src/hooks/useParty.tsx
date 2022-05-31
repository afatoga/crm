import {  useMutation, useLazyQuery, useQuery  } from '@apollo/client'; /*makeVar,useLazyQuery*/

import {
    GET_PARTYRELATIONSHIPS,
    //GET_ALL_PERSONS,
    GET_PERSONS_BY_APPUSERGROUP,
    GET_PERSON_BY_ID,
    GET_PARTYRELATIONSHIP_TYPE_LIST
} from '../api/party/queries';
import {
    GET_STATUS_LIST
} from '../api/status/queries';
import {
    CREATE_PERSON,
    UPDATE_PERSON,
    DELETE_PERSON,
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

    const getPartyRelationships = useLazyQuery(GET_PARTYRELATIONSHIPS);

    const getPartyRelationshipTypeList = useLazyQuery(GET_PARTYRELATIONSHIP_TYPE_LIST);

    const createPerson = useMutation(CREATE_PERSON, {
        fetchPolicy: 'network-only',
    })
    const updatePerson = useMutation(UPDATE_PERSON, {
        fetchPolicy: 'network-only',
    })
    const deletePerson = useMutation(DELETE_PERSON, {
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
            getPartyRelationshipTypeList,
            createPerson,
            updatePerson,
            deletePerson,
            createPartyRelationship,
            deletePartyRelationship
        }
    }
}