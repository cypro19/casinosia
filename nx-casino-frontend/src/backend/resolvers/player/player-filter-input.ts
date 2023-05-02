import { Field, InputType, Int } from "type-graphql";

@InputType()
export class PlayerFilterOptionsInput {
  @Field(() => String!, {
    nullable: true,
    description: "Search for email, id, name",
  })
  text?: string;

  @Field(() => [String!], { nullable: true })
  country?: string[];

  @Field(() => Boolean!, { nullable: true })
  isVerified?: boolean;

  @Field(() => Boolean!, { nullable: true })
  isExcluded?: boolean;

  @Field(() => Boolean!, { nullable: true })
  isBonusReceived?: boolean;

  @Field(() => Boolean!, { nullable: true })
  isSmsOptedIn?: boolean;

  @Field(() => Boolean!, { nullable: true })
  isEmailOptedIn?: boolean;

  @Field(() => Int!, { nullable: true })
  gamesPlayed!: number;

  @Field(() => [String!], { nullable: true })
  tags?: string[];

  @Field(() => [String!], { nullable: true })
  groups?: string[];

  @Field(() => [String!], { nullable: true })
  currencies?: string[];

  @Field(() => Int!, { nullable: true })
  minBalance?: number;

  @Field(() => Int!, { nullable: true })
  maxBalance?: number;

  @Field(() => Int!, { nullable: true })
  minDeposit?: number;

  @Field(() => Int!, { nullable: true })
  maxDeposit?: number;

  @Field(() => Int!, { nullable: true })
  minWithdraw?: number;

  @Field(() => Int!, { nullable: true })
  maxWithdraw?: number;

  @Field(() => Int!, { nullable: true })
  minPoints?: number;

  @Field(() => Int!, { nullable: true })
  maxPoints?: number;

  @Field(() => [String!], { nullable: true })
  affiliates?: string[];

  @Field(() => [String!], { nullable: true })
  managers?: string[];

  @Field(() => Int!, { nullable: true })
  startRegistrationDate?: number;

  @Field(() => Int!, { nullable: true })
  endRegistrationDate?: number;
}
