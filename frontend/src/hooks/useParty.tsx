import {  useMutation, useLazyQuery, makeVar, useApolloClient  } from '@apollo/client';

import {
    GET_PARTYRELATIONSHIPS,
    GET_PEOPLE,
    GET_ORGANIZATIONS,
    GET_PARTIES_BY_NAME,
    GET_PERSON_BY_ID,
    GET_ORGANIZATION_BY_ID,
    GET_PARTYRELATIONSHIP_TYPE_LIST
} from '../api/party/queries';

import {
    GET_PARTYRELATIONSHIP_CONTACTS
} from '../api/contact/queries';

import {
    GET_STATUS_LIST
} from '../api/status/queries';
import {
    CREATE_PERSON,
    UPDATE_PERSON,
    DELETE_PERSON,
    CREATE_ORGANIZATION,
    UPDATE_ORGANIZATION,
    DELETE_ORGANIZATION,
    CREATE_PARTYRELATIONSHIP,
    // UPDATE_PARTYRELATIONSHIP,
    DELETE_PARTYRELATIONSHIP
} from '../api/party/mutations';
import { isEmptyObject } from '../utils/utilityFunctions';

export type PartyOption = {
    id: string;
    name: string;
    typeId: string;
}

type PartyRelationship = {
    id: string;
    typeId: string;
    firstPartyId: number;
    secondPartyId: number;
    //firstPartyTypeId: number;
    //secondPartyTypeId: number;
    firstPartyName: string; 
    secondPartyName: string; 
}

export interface IPartyRelationship extends PartyRelationship {
    __typename: string;
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
export const partyRelationshipListVar = makeVar<IPartyRelationship[]>([]);

export function useParty() {

    const client = useApolloClient();

    const getPeople = useLazyQuery(GET_PEOPLE);
    const getOrganizations = useLazyQuery(GET_ORGANIZATIONS);

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
    const getOrganizationById = useLazyQuery(GET_ORGANIZATION_BY_ID);

    const getStatusList = useLazyQuery(GET_STATUS_LIST);

    const getPartyRelationships = useLazyQuery(GET_PARTYRELATIONSHIPS, {
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
           
            if (data?.partyRelationships && !isEmptyObject(data.partyRelationships)) {

                let partyRelationshipList = [];
                Object.keys(data.partyRelationships).forEach((key: string) => {
                  
                    if (typeof data.partyRelationships[key] !== 'string' &&  data.partyRelationships[key].length) {

                        data.partyRelationships[key].forEach((relationship: IPartyRelationship) => {
                            partyRelationshipList.push(relationship);
                        })
                    }
                })
                if (partyRelationshipList.length) partyRelationshipListVar(partyRelationshipList);
            }
        }
    });

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
    const createOrganization = useMutation(CREATE_ORGANIZATION, {
        fetchPolicy: 'network-only',
    })
    const updateOrganization = useMutation(UPDATE_ORGANIZATION, {
        fetchPolicy: 'network-only',
    })
    const deleteOrganization = useMutation(DELETE_ORGANIZATION, {
        fetchPolicy: 'network-only',
    })
    const createPartyRelationship = useMutation(CREATE_PARTYRELATIONSHIP, {
        fetchPolicy: 'network-only',
        refetchQueries: [
            GET_PARTYRELATIONSHIPS
            // {
            //     query: GET_PARTYRELATIONSHIPS,
            // }
        ]
    })
    const deletePartyRelationship = useMutation(DELETE_PARTYRELATIONSHIP, {
        fetchPolicy: 'network-only',
        refetchQueries: [
            GET_PARTYRELATIONSHIP_CONTACTS
        ]
    })



    return {
        operations: {
            // getAllPersons,
            getPeople,
            getOrganizations,
            getPartiesByName,
            getPersonById,
            getOrganizationById,
            getStatusList,
            getPartyRelationships,
            getPartyRelationshipTypeList,
            retrievePartyRelationshipTypesFromCache,
            createPerson,
            updatePerson,
            deletePerson,
            createOrganization,
            updateOrganization,
            deleteOrganization,
            createPartyRelationship,
            deletePartyRelationship
        }
    }
}