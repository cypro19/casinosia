import * as v from "@badrap/valita";

const KycStatusSchema = v.union(
  v.literal("APPROVED"),
  v.literal("PENDING"),
  v.literal("REJECTED"),
  v.literal("REQUESTED"),
  v.literal("RE-REQUESTED")
);

const DateSchema = v.unknown().chain((dateValue) => {
  const date = new Date(dateValue as any);

  // If the date is invalid JS returns NaN here
  if (isNaN(date.getTime())) {
    return v.err(`Invalid date "${dateValue}"`);
  }

  return v.ok(date);
});

export const UserSchema = v.object({
  user_id: v.string(),
  first_name: v.string(),
  last_name: v.string(),
  email: v.string(),
  date_of_birth: DateSchema,
  gender: v.string(),
  username: v.string(),
  country_code: v.string(),
  phone_code: v.string(),
  city: v.string(),
  zip_code: v.string(),
  password: v.literal("deprecated"),
  sign_in_count: v.number(),
  is_active: v.boolean(),
  affiliate_status: v.boolean(),
  currency_code: v.string(),
  kyc_status: KycStatusSchema,
  logged_in: v.boolean(),
  address: v.string(),
  level: v.number(),
  loyalty_points: v.number(),
  created_at: DateSchema,
  updated_at: DateSchema,
});

export type UserSchema = v.Infer<typeof UserSchema>;

export type UserSchemaMandatoryProps = Pick<
  UserSchema,
  | "user_id"
  | "email"
  | "country_code"
  | "currency_code"
  | "first_name"
  | "last_name"
  | "date_of_birth"
  | "city"
  | "address"
  | "gender"
>;

export const createUserEntity = (
  props: UserSchemaMandatoryProps
): UserSchema => {
  const now = new Date();
  const user: UserSchema = {
    ...props,
    affiliate_status: false,
    created_at: now,
    updated_at: now,
    is_active: true,
    kyc_status: "REQUESTED",
    level: 1,
    loyalty_points: 0,
    logged_in: false,
    password: "deprecated",
    username: "deprecated",
    phone_code: "",
    sign_in_count: 0,
    zip_code: "",
  };

  return UserSchema.parse(user, {
    mode: "strip",
  });
};
