// https://the-guild.dev/graphql/codegen was used to generate this file

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type Query = {
  __typename?: "Query";
  login: AppUserLoginResponse;
  allAppUsers: Array<AppUser>;
  personsByAppUserGroup: Array<Person>;
  organizationsByAppUserGroup?: Maybe<Array<Organization>>;
  personById?: Maybe<ExtendedPerson>;
  organizationById?: Maybe<ExtendedOrganization>;
  partiesByName: Array<PartyWithName>;
  partyRelationships: SortedPartyRelationships;
  partyRelationshipTypeList: Array<PartyRelationshipType>;
  tagById?: Maybe<Tag>;
  tagsByAppUserGroup: Array<ExtendedTag>;
  singlePartyTags: Array<Tag>;
  taggedParties?: Maybe<Array<ExtendedTagParty>>;
  tagsByName: Array<ExtendedTag>;
  contactTypeList: Array<ContactType>;
  partyPrivateContacts: Array<ExtendedContact>;
  partyRelationshipContacts: Array<ExtendedContact>;
  statusList: Array<Status>;
  searchResults: SearchResponse;
};

export type QueryLoginArgs = {
  data: AppUserLogin;
};

export type QueryAllAppUsersArgs = {
  data: AppUserGroupUniqueInput;
};

export type QueryPersonsByAppUserGroupArgs = {
  data: PartyByAppUserGroupInput;
};

export type QueryOrganizationsByAppUserGroupArgs = {
  data: PartyByAppUserGroupInput;
};

export type QueryPersonByIdArgs = {
  data: PartyByAppUserGroupInput;
};

export type QueryOrganizationByIdArgs = {
  data: PartyByAppUserGroupInput;
};

export type QueryPartiesByNameArgs = {
  data: PartyByNameInput;
};

export type QueryPartyRelationshipsArgs = {
  appUserGroupId: Scalars["Int"];
  partyId: Scalars["Int"];
};

export type QueryTagByIdArgs = {
  data: TagByAppUserGroupInput;
};

export type QueryTagsByAppUserGroupArgs = {
  data: TagByAppUserGroupInput;
};

export type QuerySinglePartyTagsArgs = {
  data: SinglePartyTagsInput;
};

export type QueryTaggedPartiesArgs = {
  data: TaggedPartiesInput;
};

export type QueryTagsByNameArgs = {
  data: TagsByNameInput;
};

export type QueryPartyPrivateContactsArgs = {
  data: PartyContactsInput;
};

export type QueryPartyRelationshipContactsArgs = {
  data: PartyRelationshipContactsInput;
};

export type QuerySearchResultsArgs = {
  data: SearchInput;
};

export type AppUserLoginResponse = {
  __typename?: "AppUserLoginResponse";
  appUser: AppUser;
  accessToken: Scalars["String"];
};

export type AppUser = {
  __typename?: "AppUser";
  id: Scalars["ID"];
  email: Scalars["String"];
  password: Scalars["String"];
  nickname?: Maybe<Scalars["String"]>;
  appUserGroupRelationships: Array<AppUserGroupRelationship>;
  count: Scalars["Float"];
};

export type AppUserGroupRelationship = {
  __typename?: "AppUserGroupRelationship";
  appUserId: Scalars["Float"];
  appUserGroupId: Scalars["Float"];
  appUserRoleId: Scalars["Float"];
};

export type AppUserLogin = {
  email: Scalars["String"];
  password: Scalars["String"];
};

export type AppUserGroupUniqueInput = {
  id: Scalars["Float"];
};

export type Person = {
  __typename?: "Person";
  partyId: Scalars["ID"];
  preDegree?: Maybe<Scalars["String"]>;
  name: Scalars["String"];
  surname: Scalars["String"];
  postDegree?: Maybe<Scalars["String"]>;
  birthday?: Maybe<Scalars["String"]>;
};

export type PartyByAppUserGroupInput = {
  appUserGroupId: Scalars["Int"];
  partyTypeId?: InputMaybe<Scalars["Float"]>;
  id?: InputMaybe<Scalars["Int"]>;
  statusId?: InputMaybe<Scalars["Int"]>;
};

export type Organization = {
  __typename?: "Organization";
  partyId: Scalars["ID"];
  name: Scalars["String"];
  typeId?: Maybe<Scalars["Float"]>;
};

export type ExtendedPerson = {
  __typename?: "ExtendedPerson";
  partyId: Scalars["ID"];
  preDegree?: Maybe<Scalars["String"]>;
  name: Scalars["String"];
  surname: Scalars["String"];
  postDegree?: Maybe<Scalars["String"]>;
  birthday?: Maybe<Scalars["String"]>;
  statusId?: Maybe<Scalars["Float"]>;
};

export type ExtendedOrganization = {
  __typename?: "ExtendedOrganization";
  partyId: Scalars["ID"];
  name: Scalars["String"];
  typeId?: Maybe<Scalars["Float"]>;
  statusId?: Maybe<Scalars["Float"]>;
};

export type PartyWithName = {
  __typename?: "PartyWithName";
  id: Scalars["ID"];
  typeId: Scalars["Float"];
  name?: Maybe<Scalars["String"]>;
};

export type PartyByNameInput = {
  searchedName: Scalars["String"];
  appUserGroupId: Scalars["Int"];
  statusId?: InputMaybe<Scalars["Int"]>;
};

export type SortedPartyRelationships = {
  __typename?: "SortedPartyRelationships";
  organizationToOrganization: Array<ExtendedPartyRelationship>;
  personToOrganization: Array<ExtendedPartyRelationship>;
  personToPerson: Array<ExtendedPartyRelationship>;
};

export type ExtendedPartyRelationship = {
  __typename?: "ExtendedPartyRelationship";
  id: Scalars["ID"];
  typeId?: Maybe<Scalars["Float"]>;
  firstPartyId: Scalars["Float"];
  firstPartyTypeId: Scalars["Float"];
  secondPartyId: Scalars["Float"];
  secondPartyTypeId: Scalars["Float"];
  firstPartyName: Scalars["String"];
  secondPartyName: Scalars["String"];
};

export type PartyRelationshipType = {
  __typename?: "PartyRelationshipType";
  id: Scalars["ID"];
  name: Scalars["String"];
  category?: Maybe<Scalars["String"]>;
};

export type Tag = {
  __typename?: "Tag";
  id: Scalars["ID"];
  statusId?: Maybe<Scalars["Float"]>;
  name: Scalars["String"];
  createdAt: Scalars["DateTime"];
  updatedAt?: Maybe<Scalars["DateTime"]>;
  appUserGroupId?: Maybe<Scalars["Float"]>;
};

export type TagByAppUserGroupInput = {
  appUserGroupId: Scalars["Int"];
  id?: InputMaybe<Scalars["Int"]>;
  statusId?: InputMaybe<Scalars["Int"]>;
};

export type ExtendedTag = {
  __typename?: "ExtendedTag";
  id: Scalars["ID"];
  statusId?: Maybe<Scalars["Float"]>;
  name: Scalars["String"];
  createdAt: Scalars["DateTime"];
  updatedAt?: Maybe<Scalars["DateTime"]>;
  appUserGroupId?: Maybe<Scalars["Float"]>;
  statusName?: Maybe<Scalars["String"]>;
};

export type SinglePartyTagsInput = {
  partyId: Scalars["Int"];
  appUserGroupId: Scalars["Int"];
};

export type ExtendedTagParty = {
  __typename?: "ExtendedTagParty";
  tagId: Scalars["ID"];
  partyId: Scalars["ID"];
  tagName?: Maybe<Scalars["String"]>;
  personFullName?: Maybe<Scalars["String"]>;
  organizationName?: Maybe<Scalars["String"]>;
  typeId: Scalars["ID"];
};

export type TaggedPartiesInput = {
  tagId: Scalars["Int"];
  appUserGroupId: Scalars["Int"];
};

export type TagsByNameInput = {
  searchedName: Scalars["String"];
  appUserGroupId: Scalars["Int"];
  statusId?: InputMaybe<Scalars["Int"]>;
};

export type ContactType = {
  __typename?: "ContactType";
  id: Scalars["ID"];
  name: Scalars["String"];
};

export type ExtendedContact = {
  __typename?: "ExtendedContact";
  id: Scalars["ID"];
  typeId?: Maybe<Scalars["ID"]>;
  statusId?: Maybe<Scalars["ID"]>;
  value: Scalars["String"];
  createdAt: Scalars["DateTime"];
  updatedAt?: Maybe<Scalars["DateTime"]>;
  mainPartyId: Scalars["ID"];
  partyRelationshipId?: Maybe<Scalars["Float"]>;
  appUserGroupId: Scalars["ID"];
  contactType?: Maybe<ContactType>;
  status?: Maybe<Status>;
};

export type Status = {
  __typename?: "Status";
  id: Scalars["ID"];
  name: Scalars["String"];
};

export type PartyContactsInput = {
  partyId: Scalars["Int"];
  statusId?: InputMaybe<Scalars["Int"]>;
  appUserGroupId: Scalars["Int"];
};

export type PartyRelationshipContactsInput = {
  partyId: Scalars["Int"];
  partyRelationshipIdList: Array<Scalars["Int"]>;
  statusId?: InputMaybe<Scalars["Int"]>;
  appUserGroupId: Scalars["Int"];
};

export type SearchResponse = {
  __typename?: "SearchResponse";
  status: ResponseStatus;
  results: Array<SearchResult>;
  count: Scalars["Int"];
};

export enum ResponseStatus {
  Success = "SUCCESS",
  Error = "ERROR",
}

export type SearchResult = {
  __typename?: "SearchResult";
  entityId: Scalars["ID"];
  entity: Entity;
  searchedValue: Scalars["String"];
  contactPartyId?: Maybe<Scalars["ID"]>;
  contactPartyTypeId?: Maybe<Scalars["ID"]>;
};

export enum Entity {
  Person = "PERSON",
  Organization = "ORGANIZATION",
  Contact = "CONTACT",
  Tag = "TAG",
}

export type SearchInput = {
  searchedText: Scalars["String"];
  appUserGroupId: Scalars["Int"];
};

export type Mutation = {
  __typename?: "Mutation";
  createAppUser: ApiResponse;
  createUpdateAppUser: ApiResponse;
  createPerson: Person;
  updatePerson: Person;
  deletePerson: ApiResponse;
  createOrganization: Organization;
  updateOrganization: Organization;
  deleteOrganization: ApiResponse;
  createPartyRelationship: PartyRelationship;
  updatePartyRelationship: PartyRelationship;
  deletePartyRelationship: ApiResponse;
  createTag: Tag;
  updateTag: Tag;
  deleteTagParty: ApiResponse;
  createTagParty: ApiResponse;
  deleteContact: ApiResponse;
  createContact: Contact;
  updateContact: Contact;
};

export type MutationCreateAppUserArgs = {
  data: CreateAppUserInput;
};

export type MutationCreateUpdateAppUserArgs = {
  data: AppUserInput;
};

export type MutationCreatePersonArgs = {
  data: PersonInput;
};

export type MutationUpdatePersonArgs = {
  data: PersonInput;
};

export type MutationDeletePersonArgs = {
  data: DeletePartyInput;
};

export type MutationCreateOrganizationArgs = {
  data: OrganizationInput;
};

export type MutationUpdateOrganizationArgs = {
  data: OrganizationInput;
};

export type MutationDeleteOrganizationArgs = {
  data: DeletePartyInput;
};

export type MutationCreatePartyRelationshipArgs = {
  data: PartyRelationshipInput;
};

export type MutationUpdatePartyRelationshipArgs = {
  data: UpdatePartyRelationshipInput;
};

export type MutationDeletePartyRelationshipArgs = {
  appUserGroupId: Scalars["Int"];
  id: Scalars["Int"];
};

export type MutationCreateTagArgs = {
  data: TagInput;
};

export type MutationUpdateTagArgs = {
  data: TagInput;
};

export type MutationDeleteTagPartyArgs = {
  data: DeleteTagPartyInput;
};

export type MutationCreateTagPartyArgs = {
  data: CreateTagPartyInput;
};

export type MutationDeleteContactArgs = {
  data: DeleteContactInput;
};

export type MutationCreateContactArgs = {
  data: ContactInput;
};

export type MutationUpdateContactArgs = {
  data: ContactInput;
};

export type ApiResponse = {
  __typename?: "APIResponse";
  status: ResponseStatus;
  message: Scalars["String"];
};

export type CreateAppUserInput = {
  email: Scalars["String"];
  nickname: Scalars["String"];
  password: Scalars["String"];
};

export type AppUserInput = {
  id?: InputMaybe<Scalars["Float"]>;
  email?: InputMaybe<Scalars["String"]>;
  password?: InputMaybe<Scalars["String"]>;
  nickname?: InputMaybe<Scalars["String"]>;
  appUserGroupId?: InputMaybe<Scalars["Float"]>;
  appUserRoleId?: InputMaybe<Scalars["Float"]>;
};

export type PersonInput = {
  partyId?: InputMaybe<Scalars["Int"]>;
  statusId?: InputMaybe<Scalars["Int"]>;
  preDegree?: InputMaybe<Scalars["String"]>;
  name: Scalars["String"];
  surname: Scalars["String"];
  postDegree?: InputMaybe<Scalars["String"]>;
  birthday?: InputMaybe<Scalars["DateTime"]>;
  appUserGroupId?: InputMaybe<Scalars["Int"]>;
};

export type DeletePartyInput = {
  partyId: Scalars["Int"];
  appUserGroupId: Scalars["Int"];
};

export type OrganizationInput = {
  partyId?: InputMaybe<Scalars["Int"]>;
  statusId?: InputMaybe<Scalars["Int"]>;
  name: Scalars["String"];
  typeId?: InputMaybe<Scalars["Int"]>;
  appUserGroupId?: InputMaybe<Scalars["Int"]>;
};

export type PartyRelationship = {
  __typename?: "PartyRelationship";
  id: Scalars["ID"];
  typeId?: Maybe<Scalars["Float"]>;
  firstPartyId: Scalars["Float"];
  firstPartyTypeId: Scalars["Float"];
  secondPartyId: Scalars["Float"];
  secondPartyTypeId: Scalars["Float"];
};

export type PartyRelationshipInput = {
  firstPartyId?: InputMaybe<Scalars["Int"]>;
  secondPartyId?: InputMaybe<Scalars["Int"]>;
  typeId?: InputMaybe<Scalars["Int"]>;
  appUserGroupId: Scalars["Int"];
};

export type UpdatePartyRelationshipInput = {
  id: Scalars["Int"];
  firstPartyId?: InputMaybe<Scalars["Int"]>;
  secondPartyId?: InputMaybe<Scalars["Int"]>;
  typeId?: InputMaybe<Scalars["Int"]>;
  appUserGroupId: Scalars["Int"];
};

export type TagInput = {
  id?: InputMaybe<Scalars["Int"]>;
  statusId?: InputMaybe<Scalars["Int"]>;
  name: Scalars["String"];
  partyId?: InputMaybe<Scalars["Int"]>;
  appUserGroupId?: InputMaybe<Scalars["Int"]>;
};

export type DeleteTagPartyInput = {
  partyId: Scalars["Int"];
  tagId: Scalars["Int"];
  appUserGroupId: Scalars["Int"];
};

export type CreateTagPartyInput = {
  tagId: Scalars["Int"];
  partyId: Scalars["Int"];
  appUserGroupId: Scalars["Int"];
};

export type DeleteContactInput = {
  id: Scalars["Int"];
  appUserGroupId: Scalars["Int"];
};

export type Contact = {
  __typename?: "Contact";
  id: Scalars["ID"];
  typeId?: Maybe<Scalars["ID"]>;
  statusId?: Maybe<Scalars["ID"]>;
  value: Scalars["String"];
  createdAt: Scalars["DateTime"];
  updatedAt?: Maybe<Scalars["DateTime"]>;
  mainPartyId: Scalars["ID"];
  partyRelationshipId?: Maybe<Scalars["Float"]>;
  appUserGroupId: Scalars["ID"];
};

export type ContactInput = {
  id?: InputMaybe<Scalars["Int"]>;
  typeId?: InputMaybe<Scalars["Int"]>;
  statusId?: InputMaybe<Scalars["Int"]>;
  value?: InputMaybe<Scalars["String"]>;
  mainPartyId?: InputMaybe<Scalars["Int"]>;
  partyRelationshipId?: InputMaybe<Scalars["Int"]>;
  appUserGroupId: Scalars["Int"];
};
