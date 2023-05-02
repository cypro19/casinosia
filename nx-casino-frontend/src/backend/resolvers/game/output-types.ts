import { Field, InputType, ObjectType } from "type-graphql";

@ObjectType()
export class GameTag {
  @Field()
  id!: string;

  @Field()
  tagName!: string;
}

@ObjectType()
export class Game {
  @Field()
  id!: string;

  @Field()
  icon!: string;

  @Field()
  provider!: string;

  @Field()
  cta!: string;

  @Field()
  name!: string;

  @Field()
  status!: string;
}
