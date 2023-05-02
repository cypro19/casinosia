import { Field, InputType, registerEnumType } from "type-graphql";

export enum SortDirection {
  Ascending = "ASC",
  Descending = "DESC",
}

registerEnumType(SortDirection, {
  name: "SortDirection",
  description: "Specify which direction sort should happen",
});

@InputType()
export class SortInput<T extends { [key: string]: any }> {
  @Field(() => String, { nullable: true, defaultValue: "createdDate" })
  field?: keyof T;

  @Field(() => SortDirection, {
    nullable: true,
    defaultValue: SortDirection.Descending,
  })
  order?: SortDirection;
}
