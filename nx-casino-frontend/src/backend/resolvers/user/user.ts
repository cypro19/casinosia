import type { AppContext } from "../../app/context";
import { Mutation, Resolver, Ctx, Arg, Query } from "type-graphql";
import { PlayerAuthorized } from "../../decorators/player-authentication";
import { CognitoService } from "../../services/user-service/cognito-service";
import { UserService } from "../../services/user-service/user-service";
import {
  ConfirmRegistrationInput,
  UserPasswordLogin,
  UserRefreshTokenLogin,
  UserRegistrationForm,
} from "./input-types";
import {
  User,
  UserLoginCredentials,
  UserRefreshCredentials,
} from "./output-types";

@Resolver()
export class UserResolver {
  @Mutation(() => User!)
  async signUpUser(
    @Ctx() context: AppContext,
    @Arg("input") input: UserRegistrationForm
  ): Promise<User> {
    const user = await UserService.signUpUser(context, input);

    return {
      address: user.address,
      birthDate: user.date_of_birth,
      city: user.city,
      country: user.country_code,
      currency: user.currency_code,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      gender: user.gender,
      userId: user.user_id,
    };
  }

  @Mutation(() => User!)
  async confirmUser(
    @Ctx() context: AppContext,
    @Arg("input") input: ConfirmRegistrationInput
  ): Promise<User> {
    const user = await UserService.confirmUser(context, input);

    return {
      address: user.address,
      birthDate: user.date_of_birth,
      city: user.city,
      country: user.country_code,
      currency: user.currency_code,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      gender: user.gender,
      userId: user.user_id,
    };
  }

  async registerUser(
    @Ctx() context: AppContext,
    @Arg("input") input: UserRegistrationForm
  ): Promise<User> {
    const user = await UserService.registerUser(context, input);

    return {
      address: user.address,
      birthDate: user.date_of_birth,
      city: user.city,
      country: user.country_code,
      currency: user.currency_code,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      gender: user.gender,
      userId: user.user_id,
    };
  }

  @Query(() => UserLoginCredentials!)
  async loginWithPassword(
    @Ctx() context: AppContext,
    @Arg("input") input: UserPasswordLogin
  ): Promise<UserLoginCredentials> {
    const credentials = await CognitoService.loginWithPassword(context, input);

    context.response.cookies.setCookie({
      name: "x-refresh-token",
      value: credentials.refreshToken,
      path: "/",
    });

    context.response.cookies.setCookie({
      name: "x-access-token",
      value: credentials.accessToken,
      path: "/",
    });

    return credentials;
  }

  @Query(() => String)
  async logout(@Ctx() context: AppContext) {
    context.response.cookies.setCookie({
      name: "x-refresh-token",
      value: "",
      path: "/",
      expire: new Date(0),
    });

    context.response.cookies.setCookie({
      name: "x-access-token",
      value: "",
      path: "/",
      expire: new Date(0),
    });
  }

  @Query(() => UserRefreshCredentials!)
  async loginWithRefreshToken(
    @Ctx() context: AppContext,
    @Arg("input") input: UserRefreshTokenLogin
  ): Promise<UserRefreshCredentials> {
    const credentials = await CognitoService.loginWithRefreshToken(
      context,
      input
    );

    context.response.cookies.setCookie({
      name: "x-access-token",
      value: credentials.accessToken,
      path: "/",
    });

    return credentials;
  }

  @PlayerAuthorized()
  @Query(() => User!)
  async user(@Ctx() context: AppContext): Promise<User> {
    if (!context.request.userId) {
      throw new Error("UserId is not set");
    }

    const user = await UserService.getUser(context, context.request.userId);

    return {
      address: user.address,
      birthDate: user.date_of_birth,
      city: user.city,
      country: user.country_code,
      currency: user.currency_code,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      gender: user.gender,
      userId: user.user_id,
    };
  }
}
