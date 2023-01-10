import {
  useMutation,
  useLazyQuery,
  useApolloClient,
  makeVar,
} from "@apollo/client";

import {
  GET_PARTY_PRIVATE_CONTACTS,
  GET_PARTYRELATIONSHIP_CONTACTS,
  GET_CONTACTTYPE_LIST,
} from "../api/contact/queries";

import { partyRelationshipListVar } from "./useParty";

import { GET_STATUS_LIST } from "../api/status/queries";

import {
  CREATE_CONTACT,
  UPDATE_CONTACT,
  DELETE_CONTACT,
} from "../api/contact/mutations";
import { ExtendedContact } from "../types/codegen";

export const contactToEditVar = makeVar<string>(""); //contactId to load data in modal component
export const extendedPartyRelationshipContactsVar = makeVar<
  ExtendedPartyRelationshipContact[]
>([]);

interface ExtendedPartyRelationshipContact extends ExtendedContact {
  otherPartyName: string;
}

export function useContact() {
  const client = useApolloClient();

  const getContactTypeList = useLazyQuery(GET_CONTACTTYPE_LIST, {
    fetchPolicy: "cache-first",
  });
  const getPartyPrivateContacts = useLazyQuery(GET_PARTY_PRIVATE_CONTACTS);

  const getPartyRelationshipContacts = useLazyQuery(
    GET_PARTYRELATIONSHIP_CONTACTS,
    {
      onCompleted: (data) => {
        if (data?.partyRelationshipContacts.length) {
          const partyRelationships = partyRelationshipListVar();

          const list: ExtendedContact[] = data.partyRelationshipContacts;

          let extendedData = list.map((contact) => {
            const found = partyRelationships.find((partyRelationship) => {
              if (
                parseInt(partyRelationship.id) === contact.partyRelationshipId
              )
                return partyRelationship;
              else return false;
            });

            return {
              ...contact,
              otherPartyName: found
                ? contact.mainPartyId === found.firstPartyId.toString()
                  ? found.secondPartyName
                  : found.firstPartyName
                : "",
            };
          });

          extendedPartyRelationshipContactsVar(extendedData);
        } else {
          extendedPartyRelationshipContactsVar([]); //reset
        }
      },
    }
  );

  const retrieveStatusListFromCache = () => {
    const data = client.readQuery({
      query: GET_STATUS_LIST,
    });

    if (!data?.statusList || !data.statusList.length) return { data: null };

    return { data };
  };

  const retrievePartyPrivateContactsCache = (variables: {
    appUserGroupId: number;
    partyId: number;
    statusId?: string;
  }) => {
    const data = client.readQuery({
      query: GET_PARTY_PRIVATE_CONTACTS,
      variables: variables,
    });

    if (!data?.partyPrivateContacts || !data.partyPrivateContacts.length)
      return [];

    return data.partyPrivateContacts;
  };

  const createContact = useMutation(CREATE_CONTACT, {
    fetchPolicy: "network-only",
    refetchQueries: [
      GET_PARTY_PRIVATE_CONTACTS,
      GET_PARTYRELATIONSHIP_CONTACTS,
    ],
  });
  const updateContact = useMutation(UPDATE_CONTACT, {
    fetchPolicy: "network-only",
    refetchQueries: [
      GET_PARTY_PRIVATE_CONTACTS,
      GET_PARTYRELATIONSHIP_CONTACTS,
    ],
  });
  const deleteContact = useMutation(DELETE_CONTACT, {
    fetchPolicy: "network-only",
    refetchQueries: [
      GET_PARTY_PRIVATE_CONTACTS,
      GET_PARTYRELATIONSHIP_CONTACTS,
    ],
  });

  return {
    operations: {
      getContactTypeList,
      getPartyPrivateContacts,
      getPartyRelationshipContacts,
      createContact,
      updateContact,
      deleteContact,
      retrievePartyPrivateContactsCache,
      retrieveStatusListFromCache,
    },
  };
}
