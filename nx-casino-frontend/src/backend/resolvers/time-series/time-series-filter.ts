import { Field, InputType } from "type-graphql";

@InputType()
export class TimeSeriesFilter {
  @Field(() => Date!)
  startDate!: Date;

  @Field(() => Date!)
  endDate!: Date;
}
