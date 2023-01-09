import "reflect-metadata";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class Party {
  @Field((type) => ID)
  id: number;

  @Field((type) => Number, { nullable: true })
  typeId: number | null;

  @Field((type) => Number, { nullable: true })
  statusId: number | null;

  @Field((type) => Number)
  appUserGroupId: number;
}

@ObjectType()
export class Person {
  @Field((type) => ID)
  partyId: number;

  @Field((type) => String, { nullable: true })
  preDegree: string | null;

  @Field((type) => String)
  name: string;

  @Field((type) => String)
  surname: string;

  @Field((type) => String, { nullable: true })
  postDegree: string | null;

  @Field((type) => String, { nullable: true })
  birthday: Date | null;
}

@ObjectType()
export class ExtendedPerson extends Person {
  @Field((type) => Number, { nullable: true })
  statusId: number | null;
}

@ObjectType()
export class Organization {
  @Field((type) => ID)
  partyId: number;

  @Field((type) => String)
  name: string;

  @Field((type) => Number, { nullable: true })
  typeId: number | null;
}

// returned after query partiesByName
@ObjectType()
export class PartyWithName {
  @Field((type) => ID)
  id: number; //renamed partyId

  @Field((type) => Number)
  typeId: number; //partyTypeId to save into PartyRelationship table

  @Field((type) => String, { nullable: true })
  name: string | null;
}

@ObjectType()
export class ExtendedOrganization extends Organization {
  @Field((type) => Number, { nullable: true })
  statusId: number | null;
}

@ObjectType()
export class PartyRelationship {
  @Field((type) => ID)
  id: number;

  @Field((type) => Number, { nullable: true })
  typeId: number | null;

  @Field((type) => Number)
  firstPartyId: number;

  @Field((type) => Number)
  firstPartyTypeId: number;

  @Field((type) => Number)
  secondPartyId: number;

  @Field((type) => Number)
  secondPartyTypeId: number;
}

// returned after query partyRelationships
// Organization.name or (Person.surname + Person.name)
@ObjectType()
export class ExtendedPartyRelationship extends PartyRelationship {
  @Field((type) => String)
  firstPartyName: string;
  @Field((type) => String)
  secondPartyName: string;
}

@ObjectType()
export class SortedPartyRelationships {
  @Field((type) => [ExtendedPartyRelationship])
  organizationToOrganization: ExtendedPartyRelationship[];
  @Field((type) => [ExtendedPartyRelationship])
  personToOrganization: ExtendedPartyRelationship[];
  @Field((type) => [ExtendedPartyRelationship])
  personToPerson: ExtendedPartyRelationship[];
}

@ObjectType()
export class PartyRelationshipType {
  @Field((type) => ID)
  id: number;

  @Field((type) => String)
  name: string;

  @Field((type) => String, { nullable: true })
  category: string | null;
}
