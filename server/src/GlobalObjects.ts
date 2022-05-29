import 'reflect-metadata'
import { registerEnumType } from "type-graphql";
import { ObjectType, Field, ID } from 'type-graphql'


enum ResponseStatus {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR"
}

registerEnumType(ResponseStatus, {
  name: 'ResponseStatus',
  description: 'API Response status'
});

@ObjectType()
export class APIResponse {

  @Field((type) => ResponseStatus)
  status: string

  @Field((type) => String)
  message?: string
}