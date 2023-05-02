import { ClassType, Field, InputType, ObjectType } from "type-graphql";
import { UnionFromClasses } from "type-graphql/dist/helpers/utils";

type FieldContainer<Type> = Type extends UnionFromClasses<any>
  ? UnionFromClasses<any>
  : ClassType<Type> | string | number | boolean;

export default function PaginatedResponse<FieldType>(
  itemsFieldValue: FieldContainer<FieldType>
) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field(() => [itemsFieldValue!]!)
    items!: FieldType[];

    @Field(() => Number)
    skip!: number;

    @Field(() => Number)
    take!: number;

    @Field(() => Number)
    count!: number;
  }

  return PaginatedResponseClass;
}

@InputType()
export class PaginationOptionsInput<T extends { [key: string]: any }> {
  @Field(() => Number, { nullable: true, defaultValue: 0 })
  skip!: number;

  @Field(() => Number, { nullable: true, defaultValue: 25 })
  take!: number;
}
