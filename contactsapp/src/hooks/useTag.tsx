import {  useMutation, useLazyQuery, makeVar, useApolloClient  } from '@apollo/client'; /*makeVar,useLazyQuery*/

import {
    GET_TAGGED_PARTIES,
    GET_SINGLE_PARTY_TAGS,
    GET_TAGS,
    GET_TAGS_BY_NAME,
    GET_TAG_BY_ID,
} from '../api/tag/queries';
// import {
//     GET_STATUS_LIST
// } from '../api/status/queries';
import {
    CREATE_TAG,
    UPDATE_TAG,
    DELETE_TAG,
    CREATE_TAGPARTY,
    // UPDATE_PARTYRELATIONSHIP,
    DELETE_TAGPARTY
} from '../api/tag/mutations';

export type TagOption = {
    id: string;
    name: string;
}

interface ITagByName extends TagOption {
    __typename: string;
}

// export const reportsQueueVar = makeVar<string[]>([]);
export const filteredTagsVar = makeVar<TagOption[]>([]);

export function useTag() {

    const client = useApolloClient();
    //const getAllTAGs = useLazyQuery(GET_ALL_TAGS);

    const getTags = useLazyQuery(GET_TAGS);

    const getTagsByName = useLazyQuery(GET_TAGS_BY_NAME, {
        onCompleted: (data) => {
            let preparedOptions = [];

            if(data.tagsByName.length > 0) {
                preparedOptions = data.tagsByName.map((item: ITagByName) => ({
                    id: item.id,
                    name: item.name
                }))
            }

            filteredTagsVar(preparedOptions);
        }
    });

    const getTagById = useLazyQuery(GET_TAG_BY_ID);

    //const getStatusList = useLazyQuery(GET_STATUS_LIST);

    const getTaggedParties = useLazyQuery(GET_TAGGED_PARTIES);

    const getSinglePartyTags = useLazyQuery(GET_SINGLE_PARTY_TAGS);



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

    const createTag = useMutation(CREATE_TAG, {
        fetchPolicy: 'network-only',
    })
    const updateTag = useMutation(UPDATE_TAG, {
        fetchPolicy: 'network-only',
    })
    const deleteTag = useMutation(DELETE_TAG, {
        fetchPolicy: 'network-only',
    })

    // this will tag a party
    const createTagParty = useMutation(CREATE_TAGPARTY, {
        fetchPolicy: 'network-only',
        // refetchQueries: [
        //     {
        //         query: GET_PARTYRELATIONSHIPS,
        //     }
        // ]
    })
    const deleteTagParty = useMutation(DELETE_TAGPARTY, {
        fetchPolicy: 'network-only',
        refetchQueries: [
            GET_SINGLE_PARTY_TAGS
        ]
    })



    return {
        operations: {
            getTags,
            getTagsByName,
            getTagById,
            createTagParty,
            // getStatusList,
            // getPartyRelationships,
            // getPartyRelationshipTypeList,
            // retrievePartyRelationshipTypesFromCache,
            createTag,
            updateTag,
            deleteTag,
            getTaggedParties,
            getSinglePartyTags,
            deleteTagParty
            // createPartyRelationship,
            // deletePartyRelationship
        }
    }
}