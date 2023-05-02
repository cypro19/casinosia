import {
  Arg,
  Field,
  ID,
  InputType,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import PaginatedResponse, {
  PaginationOptionsInput,
} from "../../inputs/pagination";
import { SortInput } from "../../inputs/sort";
import { PlayerFilterOptionsInput } from "./player-filter-input";

@ObjectType()
class Player {
  @Field(() => ID)
  id!: string;

  @Field()
  username!: string;

  @Field()
  email!: string;

  @Field()
  fullName!: string;

  @Field()
  country!: string;

  @Field()
  balance!: number;

  @Field()
  totalDeposit!: number;

  @Field()
  totalWithdraw!: number;

  @Field(() => [String!]!)
  currencies!: string[];
}

@InputType()
class PlayerPaginationInput extends PaginationOptionsInput<Player> {}

@InputType()
class PlayerSortInput extends SortInput<Player> {}

@ObjectType()
class PlayersResponse extends PaginatedResponse(Player) {}

@Resolver(Player)
export class PlayerResolver {
  @Query(() => PlayersResponse)
  players(
    @Arg("pagination", { nullable: true }) pagination: PlayerPaginationInput,
    @Arg("filter", { nullable: true }) filter: PlayerFilterOptionsInput,
    @Arg("sort", { nullable: true }) sort: PlayerSortInput
  ): PlayersResponse {
    return {
      count: 10,
      items: [],
      skip: 0,
      take: 10,
    };
  }
}
