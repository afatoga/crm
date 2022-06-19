import {  useMutation, useLazyQuery  } from '@apollo/client'; /*makeVar,useLazyQuery*/

import {
    GET_PARTY_PRIVATE_CONTACTS,
    GET_PARTYRELATIONSHIP_CONTACTS,
} from '../api/contact/queries';

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
//export const filteredTagsVar = makeVar<TagOption[]>([]);

export function useContact() {

    // const client = useApolloClient();
    //const getAllTAGs = useLazyQuery(GET_ALL_TAGS);

    const getPartyPrivateContacts = useLazyQuery(GET_PARTY_PRIVATE_CONTACTS);

    const getPartyrelationshipContacts = useLazyQuery(GET_PARTYRELATIONSHIP_CONTACTS);



    // const retrievePartyRelationshipTypesFromCache = (optionCategories: string[] = []) => {
    //     const { partyRelationshipTypeList } = client.readQuery({
    //         query: GET_PARTYRELATIONSHIP_TYPE_LIST
    //     });

    //     if (!optionCategories.length) return partyRelationshipTypeList;
    //     else {
    //         return partyRelationshipTypeList.filter((item:any) => {
    //             if (optionCategories.includes(item.category)) return true;
    //         })
    //     }
    // }

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
            getPartyPrivateContacts,
            getPartyrelationshipContacts,
            createContact,
            updateContact,
            deleteContact,
            
        }
    }
}