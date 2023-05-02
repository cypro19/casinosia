import { Arg, Field, ObjectType, Query, Resolver } from "type-graphql";
import { TimeSeriesFilter } from "../time-series/time-series-filter";

@ObjectType()
class Statistics {
  @Field()
  playersOnline!: number;

  @Field()
  firstTimeDeposit!: number;

  @Field()
  netGamingRevenue!: number;

  @Field()
  totalDepositAmount!: number;

  @Field()
  totalWithdrawalAmount!: number;

  @Field()
  pendingWithdrawalAmount!: number;
}

@Resolver(Statistics)
export class StatisticsResolver {
  @Query(() => Statistics)
  statistics(
    @Arg("filter", { nullable: true }) filter: TimeSeriesFilter
  ): Statistics {
    return {} as any;
  }
}
