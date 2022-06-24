import 'reflect-metadata'
import { registerEnumType } from "type-graphql";
import { ObjectType, Field, ID, Int } from 'type-graphql'


enum ResponseStatus {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR"
}

registerEnumType(ResponseStatus, {
  name: 'ResponseStatus',
  description: 'API Response status'
});

enum Entity {
  PERSON = "PERSON",
  ORGANIZATION = "ORGANIZATION",
  CONTACT = "CONTACT",
  TAG = "TAG"
}

registerEnumType(Entity, {
  name: 'Entity',
  description: 'Entity name'
});

@ObjectType()
export class APIResponse {

  @Field((type) => ResponseStatus)
  status: string

  @Field((type) => String)
  message?: string
}

@ObjectType()
export class SearchResult {
  @Field((type) => ID) 
  entityId: string
  @Field((type) => Entity) 
  entity: string // party contact tag
  @Field((type) => String) 
  searchedValue: string // party full name, contact value, tag name
  @Field((type) => ID, {nullable: true}) 
  contactPartyId: string | null
  @Field((type) => ID, {nullable: true}) 
  contactPartyTypeId: string | null // 1, 2 (partyTypeId)
}

@ObjectType()
export class SearchResponse {

  @Field((type) => ResponseStatus)
  status: string

  @Field((type) => [SearchResult])
  results: SearchResult[]

  @Field((type) => Int)
  count: number
}
