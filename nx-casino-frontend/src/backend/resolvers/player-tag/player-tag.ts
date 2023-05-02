import { Field, ID, ObjectType, Resolver } from "type-graphql";

@ObjectType()
export class PlayerTag {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;
}

@Resolver(PlayerTag)
export class PlayerTagResolver {}
