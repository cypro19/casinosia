import { Field, InputType } from "type-graphql";

@InputType()
export class UserRegistrationForm {
  @Field()
  email!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field()
  password!: string;

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

@InputType()
export class UserPasswordLogin {
  @Field()
  username!: string;

  @Field()
  password!: string;
}

@InputType()
export class UserRefreshTokenLogin {
  @Field()
  refreshToken!: string;
}

@InputType()
export class ConfirmRegistrationInput {
  @Field()
  code!: string;

  @Field()
  username!: string;
}