import { Query, Resolver } from "type-graphql";
import { Game } from "./output-types";

@Resolver(Game)
export class GameResolver {
  @Query(() => [Game!]!)
  async games(): Promise<Game[]> {
    return [
      {
        cta: "CTA",
        icon: "/icon.jpg",
        id: "a",
        name: "Name",
        provider: "/Provider",
        status: "test",
      },
      {
        cta: "CTA",
        icon: "/icon.jpg",
        id: "b",
        name: "Name",
        provider: "/Provider",
        status: "test",
      },
      {
        cta: "CTA",
        icon: "/icon.jpg",
        id: "c",
        name: "Name",
        provider: "/Provider",
        status: "test",
      },
      {
        cta: "CTA",
        icon: "/icon.jpg",
        id: "d",
        name: "Name",
        provider: "/Provider",
        status: "test",
      },
      {
        cta: "CTA",
        icon: "/icon.jpg",
        id: "e",
        name: "Name",
        provider: "/Provider",
        status: "test",
      },
      {
        cta: "CTA",
        icon: "/icon.jpg",
        id: "f",
        name: "Name",
        provider: "/Provider",
        status: "test",
      },
    ];
  }
}
