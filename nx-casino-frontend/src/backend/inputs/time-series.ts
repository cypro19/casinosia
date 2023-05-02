import { ClassType, Field, InputType, ObjectType } from "type-graphql";
import { UnionFromClasses } from "type-graphql/dist/helpers/utils";

type FieldContainer<Type> = Type extends UnionFromClasses<any>
  ? UnionFromClasses<any>
  : ClassType<Type> | string | number | boolean;

export default function TimeSeriesResponse<FieldType>(
  itemsFieldValue: FieldContainer<FieldType>
) {
  @ObjectType({ isAbstract: true })
  abstract class TimeSeriesResponseClass {
    @Field(() => [itemsFieldValue!]!)
    dataPoints!: FieldType[];

    @Field(() => Number)
    count!: number;

    @Field(() => Date!)
    startDate!: Date;

    @Field(() => Date!)
    endDate!: Date;
  }

  return TimeSeriesResponseClass;
}

@InputType()
export class MetricsInput {
  @Field(() => Date!)
  startDate!: Date;

  @Field(() => Date!)
  endDate!: Date;
}
