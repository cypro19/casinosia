import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type ConfirmRegistrationInput = {
  code: Scalars['String'];
  username: Scalars['String'];
};

export type Game = {
  __typename?: 'Game';
  cta: Scalars['String'];
  icon: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  provider: Scalars['String'];
  status: Scalars['String'];
};

export type MetricsInput = {
  endDate: Scalars['DateTime'];
  startDate: Scalars['DateTime'];
};

export type Mutation = {
  __typename?: 'Mutation';
  confirmUser: User;
  signUpUser: User;
};


export type MutationConfirmUserArgs = {
  input: ConfirmRegistrationInput;
};


export type MutationSignUpUserArgs = {
  input: UserRegistrationForm;
};

export type NetGamingRevenue = {
  __typename?: 'NetGamingRevenue';
  count: Scalars['Float'];
  dataPoints: Array<NetGamingRevenueDataPoint>;
  endDate: Scalars['DateTime'];
  startDate: Scalars['DateTime'];
};

export type NetGamingRevenueDataPoint = {
  __typename?: 'NetGamingRevenueDataPoint';
  date: Scalars['DateTime'];
  value: Scalars['Int'];
};

export type Player = {
  __typename?: 'Player';
  balance: Scalars['Float'];
  country: Scalars['String'];
  currencies: Array<Scalars['String']>;
  email: Scalars['String'];
  fullName: Scalars['String'];
  id: Scalars['ID'];
  totalDeposit: Scalars['Float'];
  totalWithdraw: Scalars['Float'];
  username: Scalars['String'];
};

export type PlayerFilterOptionsInput = {
  affiliates?: InputMaybe<Array<Scalars['String']>>;
  country?: InputMaybe<Array<Scalars['String']>>;
  currencies?: InputMaybe<Array<Scalars['String']>>;
  endRegistrationDate?: InputMaybe<Scalars['Int']>;
  gamesPlayed?: InputMaybe<Scalars['Int']>;
  groups?: InputMaybe<Array<Scalars['String']>>;
  isBonusReceived?: InputMaybe<Scalars['Boolean']>;
  isEmailOptedIn?: InputMaybe<Scalars['Boolean']>;
  isExcluded?: InputMaybe<Scalars['Boolean']>;
  isSmsOptedIn?: InputMaybe<Scalars['Boolean']>;
  isVerified?: InputMaybe<Scalars['Boolean']>;
  managers?: InputMaybe<Array<Scalars['String']>>;
  maxBalance?: InputMaybe<Scalars['Int']>;
  maxDeposit?: InputMaybe<Scalars['Int']>;
  maxPoints?: InputMaybe<Scalars['Int']>;
  maxWithdraw?: InputMaybe<Scalars['Int']>;
  minBalance?: InputMaybe<Scalars['Int']>;
  minDeposit?: InputMaybe<Scalars['Int']>;
  minPoints?: InputMaybe<Scalars['Int']>;
  minWithdraw?: InputMaybe<Scalars['Int']>;
  startRegistrationDate?: InputMaybe<Scalars['Int']>;
  tags?: InputMaybe<Array<Scalars['String']>>;
  /** Search for email, id, name */
  text?: InputMaybe<Scalars['String']>;
};

export type PlayerPaginationInput = {
  skip?: InputMaybe<Scalars['Float']>;
  take?: InputMaybe<Scalars['Float']>;
};

export type PlayerSortInput = {
  field?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<SortDirection>;
};

export type PlayersResponse = {
  __typename?: 'PlayersResponse';
  count: Scalars['Float'];
  items: Array<Player>;
  skip: Scalars['Float'];
  take: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  firstDepositTimeSeries: NetGamingRevenue;
  games: Array<Game>;
  grossGamingRevenueTimeSeries: NetGamingRevenue;
  loginWithPassword: UserLoginCredentials;
  loginWithRefreshToken: UserRefreshCredentials;
  logout: Scalars['String'];
  netGamingRevenueTimeSeries: NetGamingRevenue;
  players: PlayersResponse;
  statistics: Statistics;
  user: User;
};


export type QueryFirstDepositTimeSeriesArgs = {
  filter?: InputMaybe<MetricsInput>;
};


export type QueryGrossGamingRevenueTimeSeriesArgs = {
  filter?: InputMaybe<MetricsInput>;
};


export type QueryLoginWithPasswordArgs = {
  input: UserPasswordLogin;
};


export type QueryLoginWithRefreshTokenArgs = {
  input: UserRefreshTokenLogin;
};


export type QueryNetGamingRevenueTimeSeriesArgs = {
  filter?: InputMaybe<MetricsInput>;
};


export type QueryPlayersArgs = {
  filter?: InputMaybe<PlayerFilterOptionsInput>;
  pagination?: InputMaybe<PlayerPaginationInput>;
  sort?: InputMaybe<PlayerSortInput>;
};


export type QueryStatisticsArgs = {
  filter?: InputMaybe<TimeSeriesFilter>;
};

/** Specify which direction sort should happen */
export enum SortDirection {
  Ascending = 'Ascending',
  Descending = 'Descending'
}

export type Statistics = {
  __typename?: 'Statistics';
  firstTimeDeposit: Scalars['Float'];
  netGamingRevenue: Scalars['Float'];
  pendingWithdrawalAmount: Scalars['Float'];
  playersOnline: Scalars['Float'];
  totalDepositAmount: Scalars['Float'];
  totalWithdrawalAmount: Scalars['Float'];
};

export type TimeSeriesFilter = {
  endDate: Scalars['DateTime'];
  startDate: Scalars['DateTime'];
};

export type User = {
  __typename?: 'User';
  address: Scalars['String'];
  birthDate: Scalars['DateTime'];
  city: Scalars['String'];
  country: Scalars['String'];
  currency: Scalars['String'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  gender: Scalars['String'];
  lastName: Scalars['String'];
  userId: Scalars['String'];
};

export type UserLoginCredentials = {
  __typename?: 'UserLoginCredentials';
  accessToken: Scalars['String'];
  /** Amount of seconds before access token and id token expires */
  expiresIn: Scalars['Int'];
  idToken: Scalars['String'];
  refreshToken: Scalars['String'];
  userId: Scalars['String'];
};

export type UserPasswordLogin = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type UserRefreshCredentials = {
  __typename?: 'UserRefreshCredentials';
  accessToken: Scalars['String'];
  /** Amount of seconds before access token and id token expires */
  expiresIn: Scalars['Int'];
  idToken: Scalars['String'];
  userId: Scalars['String'];
};

export type UserRefreshTokenLogin = {
  refreshToken: Scalars['String'];
};

export type UserRegistrationForm = {
  address: Scalars['String'];
  birthDate: Scalars['DateTime'];
  city: Scalars['String'];
  country: Scalars['String'];
  currency: Scalars['String'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  gender: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
};

export type ListGamesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListGamesQuery = { __typename?: 'Query', games: Array<{ __typename?: 'Game', id: string, icon: string, provider: string, cta: string, name: string, status: string }> };

export type LoginUserQueryVariables = Exact<{
  input: UserPasswordLogin;
}>;


export type LoginUserQuery = { __typename?: 'Query', loginWithPassword: { __typename?: 'UserLoginCredentials', userId: string, refreshToken: string, idToken: string, expiresIn: number, accessToken: string } };

export type LoginWithRefreshTokenQueryVariables = Exact<{
  input: UserRefreshTokenLogin;
}>;


export type LoginWithRefreshTokenQuery = { __typename?: 'Query', loginWithRefreshToken: { __typename?: 'UserRefreshCredentials', userId: string, idToken: string, accessToken: string, expiresIn: number } };

export type LogoutQueryVariables = Exact<{ [key: string]: never; }>;


export type LogoutQuery = { __typename?: 'Query', logout: string };

export type GetUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQuery = { __typename?: 'Query', user: { __typename?: 'User', userId: string } };

export type RegisterUserMutationVariables = Exact<{
  input: UserRegistrationForm;
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', signUpUser: { __typename?: 'User', address: string, birthDate: any, city: string, country: string, currency: string, email: string, lastName: string, userId: string, gender: string, firstName: string } };


export const ListGamesDocument = gql`
    query listGames {
  games {
    id
    icon
    provider
    cta
    name
    status
  }
}
    `;

/**
 * __useListGamesQuery__
 *
 * To run a query within a React component, call `useListGamesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListGamesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListGamesQuery({
 *   variables: {
 *   },
 * });
 */
export function useListGamesQuery(baseOptions?: Apollo.QueryHookOptions<ListGamesQuery, ListGamesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListGamesQuery, ListGamesQueryVariables>(ListGamesDocument, options);
      }
export function useListGamesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListGamesQuery, ListGamesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListGamesQuery, ListGamesQueryVariables>(ListGamesDocument, options);
        }
export type ListGamesQueryHookResult = ReturnType<typeof useListGamesQuery>;
export type ListGamesLazyQueryHookResult = ReturnType<typeof useListGamesLazyQuery>;
export type ListGamesQueryResult = Apollo.QueryResult<ListGamesQuery, ListGamesQueryVariables>;
export const LoginUserDocument = gql`
    query loginUser($input: UserPasswordLogin!) {
  loginWithPassword(input: $input) {
    userId
    refreshToken
    idToken
    expiresIn
    accessToken
  }
}
    `;

/**
 * __useLoginUserQuery__
 *
 * To run a query within a React component, call `useLoginUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginUserQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginUserQuery(baseOptions: Apollo.QueryHookOptions<LoginUserQuery, LoginUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LoginUserQuery, LoginUserQueryVariables>(LoginUserDocument, options);
      }
export function useLoginUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LoginUserQuery, LoginUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LoginUserQuery, LoginUserQueryVariables>(LoginUserDocument, options);
        }
export type LoginUserQueryHookResult = ReturnType<typeof useLoginUserQuery>;
export type LoginUserLazyQueryHookResult = ReturnType<typeof useLoginUserLazyQuery>;
export type LoginUserQueryResult = Apollo.QueryResult<LoginUserQuery, LoginUserQueryVariables>;
export const LoginWithRefreshTokenDocument = gql`
    query loginWithRefreshToken($input: UserRefreshTokenLogin!) {
  loginWithRefreshToken(input: $input) {
    userId
    idToken
    accessToken
    expiresIn
  }
}
    `;

/**
 * __useLoginWithRefreshTokenQuery__
 *
 * To run a query within a React component, call `useLoginWithRefreshTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginWithRefreshTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginWithRefreshTokenQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginWithRefreshTokenQuery(baseOptions: Apollo.QueryHookOptions<LoginWithRefreshTokenQuery, LoginWithRefreshTokenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LoginWithRefreshTokenQuery, LoginWithRefreshTokenQueryVariables>(LoginWithRefreshTokenDocument, options);
      }
export function useLoginWithRefreshTokenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LoginWithRefreshTokenQuery, LoginWithRefreshTokenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LoginWithRefreshTokenQuery, LoginWithRefreshTokenQueryVariables>(LoginWithRefreshTokenDocument, options);
        }
export type LoginWithRefreshTokenQueryHookResult = ReturnType<typeof useLoginWithRefreshTokenQuery>;
export type LoginWithRefreshTokenLazyQueryHookResult = ReturnType<typeof useLoginWithRefreshTokenLazyQuery>;
export type LoginWithRefreshTokenQueryResult = Apollo.QueryResult<LoginWithRefreshTokenQuery, LoginWithRefreshTokenQueryVariables>;
export const LogoutDocument = gql`
    query logout {
  logout
}
    `;

/**
 * __useLogoutQuery__
 *
 * To run a query within a React component, call `useLogoutQuery` and pass it any options that fit your needs.
 * When your component renders, `useLogoutQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLogoutQuery({
 *   variables: {
 *   },
 * });
 */
export function useLogoutQuery(baseOptions?: Apollo.QueryHookOptions<LogoutQuery, LogoutQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LogoutQuery, LogoutQueryVariables>(LogoutDocument, options);
      }
export function useLogoutLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LogoutQuery, LogoutQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LogoutQuery, LogoutQueryVariables>(LogoutDocument, options);
        }
export type LogoutQueryHookResult = ReturnType<typeof useLogoutQuery>;
export type LogoutLazyQueryHookResult = ReturnType<typeof useLogoutLazyQuery>;
export type LogoutQueryResult = Apollo.QueryResult<LogoutQuery, LogoutQueryVariables>;
export const GetUserDocument = gql`
    query getUser {
  user {
    userId
  }
}
    `;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserQuery(baseOptions?: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const RegisterUserDocument = gql`
    mutation registerUser($input: UserRegistrationForm!) {
  signUpUser(input: $input) {
    address
    birthDate
    city
    country
    currency
    email
    lastName
    userId
    gender
    firstName
  }
}
    `;
export type RegisterUserMutationFn = Apollo.MutationFunction<RegisterUserMutation, RegisterUserMutationVariables>;

/**
 * __useRegisterUserMutation__
 *
 * To run a mutation, you first call `useRegisterUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerUserMutation, { data, loading, error }] = useRegisterUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterUserMutation(baseOptions?: Apollo.MutationHookOptions<RegisterUserMutation, RegisterUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument, options);
      }
export type RegisterUserMutationHookResult = ReturnType<typeof useRegisterUserMutation>;
export type RegisterUserMutationResult = Apollo.MutationResult<RegisterUserMutation>;
export type RegisterUserMutationOptions = Apollo.BaseMutationOptions<RegisterUserMutation, RegisterUserMutationVariables>;