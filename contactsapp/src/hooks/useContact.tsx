import {  useMutation, useLazyQuery, useApolloClient, makeVar  } from '@apollo/client'; /*makeVar,useLazyQuery*/

import {
    GET_PARTY_PRIVATE_CONTACTS,
    GET_PARTYRELATIONSHIP_CONTACTS,
    GET_CONTACTTYPE_LIST
} from '../api/contact/queries';

import { partyRelationshipListVar, IPartyRelationship} from './useParty';

import { GET_STATUS_LIST } from '../api/status/queries';

import {
    CREATE_CONTACT,
    UPDATE_CONTACT,
    DELETE_CONTACT,
} from '../api/contact/mutations';

// export type TagOption = {
//     id: string;
//     name: string;
// }

// interface ITagByName extends TagOption {
//     __typename: string;
// }

// export const reportsQueueVar = makeVar<string[]>([]);
export const extendedPartyRelationshipContactsVar = makeVar<ExtendedPartyRelationshipContact[]>([]);

//"otherPartyName": string;
type PartyRelationshipContact = {
    "id": string;
    "mainPartyId": number;
    "partyRelationshipId": number;
    "contactType": {
      "name": string;
      "__typename": "ContactType";
    },
    "value": string;
    "status": {
      "name": string;
      "__typename": "Status";
    },
    "__typename": string;
}

interface ExtendedPartyRelationshipContact extends PartyRelationshipContact {
    otherPartyName: string;
}

export function useContact() {

    const client = useApolloClient();
    //const getAllTAGs = useLazyQuery(GET_ALL_TAGS);

    const getContactTypeList = useLazyQuery(GET_CONTACTTYPE_LIST);
    const getPartyPrivateContacts = useLazyQuery(GET_PARTY_PRIVATE_CONTACTS);

    const getPartyRelationshipContacts = useLazyQuery(GET_PARTYRELATIONSHIP_CONTACTS, {
        onCompleted: (data) => {
            if (data?.partyRelationshipContacts.length) {
                const partyRelationships = partyRelationshipListVar();

                let extendedData = data.partyRelationshipContacts.map((contact: PartyRelationshipContact) => {
                    
                    const found = partyRelationships.find((partyRelationship: IPartyRelationship) => {
                        if (parseInt(partyRelationship.id) === contact.partyRelationshipId) return partyRelationship;
                    })
                    return {
                        ...contact,
                        otherPartyName: (found) ? (contact.mainPartyId === found.firstPartyId) ? found.secondPartyName : found.firstPartyName : ''
                    }
                });

                extendedPartyRelationshipContactsVar(extendedData);
            }
        }
    });

    const retrieveStatusListFromCache = () => {
        const { statusList } = client.readQuery({
            query: GET_STATUS_LIST
        });

        if (!statusList || !statusList.length) return {data: null};

        return {data: statusList};
    }

    const createContact = useMutation(CREATE_CONTACT, {
        fetchPolicy: 'network-only',
        refetchQueries: [
            GET_PARTY_PRIVATE_CONTACTS,
            GET_PARTYRELATIONSHIP_CONTACTS
        ]
    })
    const updateContact = useMutation(UPDATE_CONTACT, {
        fetchPolicy: 'network-only',
    })
    const deleteContact = useMutation(DELETE_CONTACT, {
        fetchPolicy: 'network-only',
    })



    return {
        operations: {
            getContactTypeList,
            getPartyPrivateContacts,
            getPartyRelationshipContacts,
            createContact,
            updateContact,
            deleteContact,
            retrieveStatusListFromCache
        }
    }
}