import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
export class User {
  @Field()
  userId!: string;

  @Field()
  email!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field()
  country!: string;

  @Field()
  city!: string;

  @Field()
  address!: string;

  @Field()
  gender!: string;

  @Field()
  currency!: string;

  @Field(() => Date)
  birthDate!: Date;
}

@ObjectType()
export class UserLoginCredentials {
  @Field()
  userId!: string;

  @Field()
  refreshToken!: string;

  @Field()
  idToken!: string;

  @Field()
  accessToken!: string;

  @Field(() => Int, {
    description: "Amount of seconds before access token and id token expires",
  })
  expiresIn!: number;
}

@ObjectType()
export class UserRefreshCredentials {
  @Field()
  userId!: string;

  @Field()
  idToken!: string;

  @Field(() => Int, {
    description: "Amount of seconds before access token and id token expires",
  })
  expiresIn!: number;

  @Field()
  accessToken!: string;
}
