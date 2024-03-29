import {
  useMutation,
  useLazyQuery,
  makeVar,
  useApolloClient,
} from "@apollo/client";

import {
  GET_TAGGED_PARTIES,
  GET_SINGLE_PARTY_TAGS,
  GET_TAGS,
  GET_TAGS_BY_NAME,
  GET_TAG_BY_ID,
} from "../api/tag/queries";
import {
  CREATE_TAG,
  UPDATE_TAG,
  DELETE_TAG,
  CREATE_TAGPARTY,
  DELETE_TAGPARTY,
} from "../api/tag/mutations";

export type TagOption = {
  id: string;
  name: string;
};

interface ITagByName extends TagOption {
  __typename: string;
}

export const filteredTagsVar = makeVar<TagOption[]>([]);

export function useTag() {
  const getTags = useLazyQuery(GET_TAGS);

  const getTagsByName = useLazyQuery(GET_TAGS_BY_NAME, {
    onCompleted: (data) => {
      let preparedOptions = [];

      if (data.tagsByName.length > 0) {
        preparedOptions = data.tagsByName.map((item: ITagByName) => ({
          id: item.id,
          name: item.name,
        }));
      }

      filteredTagsVar(preparedOptions);
    },
  });

  const getTagById = useLazyQuery(GET_TAG_BY_ID);

  const getTaggedParties = useLazyQuery(GET_TAGGED_PARTIES);

  const getSinglePartyTags = useLazyQuery(GET_SINGLE_PARTY_TAGS);

  const createTag = useMutation(CREATE_TAG, {
    fetchPolicy: "network-only",
  });
  const updateTag = useMutation(UPDATE_TAG, {
    fetchPolicy: "network-only",
  });
  const deleteTag = useMutation(DELETE_TAG, {
    fetchPolicy: "network-only",
  });

  const createTagParty = useMutation(CREATE_TAGPARTY, {
    fetchPolicy: "network-only",
    refetchQueries: [GET_SINGLE_PARTY_TAGS],
  });
  const deleteTagParty = useMutation(DELETE_TAGPARTY, {
    fetchPolicy: "network-only",
    refetchQueries: [GET_SINGLE_PARTY_TAGS, GET_TAGGED_PARTIES],
  });

  return {
    operations: {
      getTags,
      getTagsByName,
      getTagById,
      createTagParty,
      createTag,
      updateTag,
      deleteTag,
      getTaggedParties,
      getSinglePartyTags,
      deleteTagParty,
    },
  };
}
