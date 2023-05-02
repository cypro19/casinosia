import { AppContext } from "../../app/context";
import { UserEntity } from "../../models/user-entity";
import {
  ConfirmRegistrationInput,
  UserRegistrationForm,
} from "../../resolvers/user/input-types";
import { createUserEntity, UserSchema } from "../../schemas/user-schema";
import { CognitoService } from "./cognito-service";

export namespace UserService {
  export const registerUser = async (
    context: AppContext,
    input: UserRegistrationForm
  ) => {
    const cognitoUser = await CognitoService.createCognitoUser(context, input);
    const userId = CognitoService.getCognitoUserAttribute(cognitoUser, "sub");

    const user = createUserEntity({
      user_id: userId,
      first_name: input.firstName,
      last_name: input.lastName,
      address: input.address,
      city: input.city,
      country_code: input.country,
      currency_code: input.currency,
      email: input.email,
      gender: input.gender,
      date_of_birth: input.birthDate,
    });

    await context.database.dbClient.getRepository(UserEntity).save(user);

    return user;
  };

  export const signUpUser = async (
    context: AppContext,
    input: UserRegistrationForm
  ) => {
    const cognitoUser = await CognitoService.signUpCognitoUser(context, input);

    const user = createUserEntity({
      user_id: cognitoUser.userId,
      first_name: input.firstName,
      last_name: input.lastName,
      address: input.address,
      city: input.city,
      country_code: input.country,
      currency_code: input.currency,
      email: input.email,
      gender: input.gender,
      date_of_birth: input.birthDate,
    });

    await context.database.dbClient.getRepository(UserEntity).save(user);

    return user;
  };

  export const getUser = async (
    context: AppContext,
    userId: string
  ): Promise<UserSchema> => {
    const user = await context.database.dbClient
      .getRepository(UserEntity)
      .findOneOrFail({
        where: {
          user_id: userId,
        },
      });

    return UserSchema.parse(user);
  };

  export const confirmUser = async (
    context: AppContext,
    input: ConfirmRegistrationInput
  ): Promise<UserEntity> => {
    const cognitoUser = await CognitoService.confirmCognitoUser(context, input);
    const userId = CognitoService.getCognitoUserAttribute(cognitoUser, "sub");

    const user = await context.database.dbClient
      .getRepository(UserEntity)
      .findOneBy({
        user_id: userId,
      });

    if (!user) {
      throw new Error(`User not found with ${userId}`);
    }

    return user;
  };
}
