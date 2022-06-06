import {  useMutation, useLazyQuery, makeVar, useApolloClient  } from '@apollo/client'; /*makeVar,useLazyQuery*/

import {
    GET_PARTYRELATIONSHIPS,
    //GET_ALL_PERSONS,
    GET_PEOPLE,
    GET_PARTIES_BY_NAME,
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

export type PartyOption = {
    id: string;
    name: string;
    typeId: string;
}

interface IPartyByName extends PartyOption {
    __typename: string;
}

type PartyRelationshipType = {
    id: string;
    name: string;
    category: string;
}

// export const reportsQueueVar = makeVar<string[]>([]);
export const filteredPartiesVar = makeVar<PartyOption[]>([]);
export const partyRelationshipTypesVar = makeVar<PartyRelationshipType[]>([]);

export function useParty() {

    const client = useApolloClient();
    //const getAllPersons = useLazyQuery(GET_ALL_PERSONS);

    const getPeople = useLazyQuery(GET_PEOPLE);

    const getPartiesByName = useLazyQuery(GET_PARTIES_BY_NAME, {
        onCompleted: (data) => {
            let preparedOptions = [];

            if(data.partiesByName.length > 0) {
                preparedOptions = data.partiesByName.map((item: IPartyByName) => ({
                    id: item.id,
                    name: item.name,
                    typeId: item.typeId
                }))
            }

            filteredPartiesVar(preparedOptions);
        }
    });

    const getPersonById = useLazyQuery(GET_PERSON_BY_ID);

    const getStatusList = useLazyQuery(GET_STATUS_LIST);

    const getPartyRelationships = useLazyQuery(GET_PARTYRELATIONSHIPS);

    const getPartyRelationshipTypeList = useLazyQuery(GET_PARTYRELATIONSHIP_TYPE_LIST, 
        // {
        //     onCompleted: (data) => {

        //         if(data.partyRelationshipTypeList.length > 0) {
        //             const dataToSave = data.partyRelationshipTypeList.map((item: any) => ({
        //                 id: item.id,
        //                 name: item.name,
        //                 category: item.category
        //             }))
                
        //             partyRelationshipTypesVar(dataToSave);
        //         }            
        //     }
        // }
    );

    const retrievePartyRelationshipTypesFromCache = (optionCategories: string[] = []) => {
        const { partyRelationshipTypeList } = client.readQuery({
            query: GET_PARTYRELATIONSHIP_TYPE_LIST
        });

        if (!optionCategories.length) return partyRelationshipTypeList;
        else {
            return partyRelationshipTypeList.filter((item:any) => {
                if (optionCategories.includes(item.category)) return true;
            })
        }
    }

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
        // refetchQueries: [
        //     {
        //         query: GET_PARTYRELATIONSHIPS,
        //     }
        // ]
    })
    const deletePartyRelationship = useMutation(DELETE_PARTYRELATIONSHIP, {
        fetchPolicy: 'network-only',
    })



    return {
        operations: {
            // getAllPersons,
            getPeople,
            getPartiesByName,
            getPersonById,
            getStatusList,
            getPartyRelationships,
            getPartyRelationshipTypeList,
            retrievePartyRelationshipTypesFromCache,
            createPerson,
            updatePerson,
            deletePerson,
            createPartyRelationship,
            deletePartyRelationship
        }
    }
}