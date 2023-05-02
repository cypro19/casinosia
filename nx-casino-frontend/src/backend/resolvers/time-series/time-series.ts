import { Arg, Field, Int, ObjectType, Query, Resolver } from "type-graphql";
import TimeSeriesResponse, { MetricsInput } from "../../inputs/time-series";

@ObjectType()
class NetGamingRevenueDataPoint {
  @Field(() => Date!)
  date!: Date;

  @Field(() => Int!)
  value!: number;
}

@ObjectType()
class NetGamingRevenue extends TimeSeriesResponse(NetGamingRevenueDataPoint) {}

@Resolver()
export class GraphResolver {
  @Query(() => NetGamingRevenue)
  netGamingRevenueTimeSeries(
    @Arg("filter", { nullable: true }) filter: MetricsInput
  ): NetGamingRevenue {
    return {} as any;
  }

  @Query(() => NetGamingRevenue)
  grossGamingRevenueTimeSeries(
    @Arg("filter", { nullable: true }) filter: MetricsInput
  ): NetGamingRevenue {
    return {} as any;
  }

  @Query(() => NetGamingRevenue)
  firstDepositTimeSeries(
    @Arg("filter", { nullable: true }) filter: MetricsInput
  ): NetGamingRevenue {
    return {} as any;
  }
}
