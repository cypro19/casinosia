export const ERRORS = {
  UNAUTHORIZED: "unauthorized",
  FORBIDDEN: "forbidden",
  NOT_FOUND: "notFound",
  METHOD_NOT_ALLOWED: "methodNotAllowed",
  BAD_DATA: "badData",
  BAD_REQUEST: "badRequest",
  INTERNAL: "internal",
  SERVER_ERROR: "serverError",
  SERVER_UNAVAILABLE: "serverUnavailable",
  EXPECTATION_FAILED: "expectationFailed",
};

export const APP_ERROR_CODES = {
  INCORRECT_CREDENTIAL: "This email/password is incorrect",
  INVALID_TOKEN: "Access token is invalid",
  INACTIVE_ADMIN: "Cannot login, current user is in-active",
  USER_NOT_FOUND: "User not found",
  EMAIL_NOT_VERIFIED: "Email is not verified",
  INCORRECT_PASSWORD: "This password is incorrect",
};

export const ERROR_MSG = {
  SERVER_ERROR: "Something went wrong",
  EXISTS: "already exists",
  NOT_FOUND: "Record not found",
  NOT_EXISTS: "does not exists",
  NOT_ALLOWED: "this action is not allowed",
  FAILED: "failed",
  BALANCE_ERROR: "Insufficient balance",
  DOMAIN_ERROR: "Domain not registered",
  WITHDRAW_ERR: "Request Failed, request already pending",
  CURRENCY_NOT_SUBSET: "Currency should be as per allowed configuration",
  CURRENCY_REQUIRED: "Currency code is required",
  USERNAME_EXIST: "Username already exists",
  EMAIL_EXIST: "Email Address already exist",
  EXTERNAL_API_ERROR: "External api response error",
  USER_DISABLE_UNTIL: "User is disabled until ", // Don't remove last space
  EXCEED_DAILY_LIMIT: "Daily bet limit reached ",
  UPDATE_DAILY_LIMIT: "Cannot update ",
  EMAIL_TOKEN_EXPIRED: "Email expired",
  EMAIL_VERIFIED: "Email already verified",
  EMAIL_ERROR: "Unable to verify your email.",
  VERIFY_EMAIL: "Verify your email",
  SENDGRID_ERROR: "Unable to send email.",
  RESET_PASSWORD_TOKEN_EXPIRED: "Reset password email expired",
  TRANSACTION_FAILED: "Transaction failed",
  UNIQUE_KEY_EXISTS: "Unique key already exists.",
  BONUS_ISSUE: "Bonus cannot be issued.",
  BONUS_CLAIM: "Bonus cannot be claimed.",
  BONUS_DELETE: "Bonus Cannot be deleted.",
  BONUS_AVAIL: "Bonus cannot be activated, try again later",
  USER_BONUS: "Action cannot be performed, bonus is claimed by user itself.",
  ACTIVE_BONUS:
    "You already have an availed bonus, to continue forfeit it first",
  LOYALTY_LEVEL_NOT_FOUND: "Loyalty level settings not found",
  REQUEST_EXISTS:
    "Bonus cannot be claimed, pending withdrawal requests exists.",
  TAKE_A_BREAK_DAY_ERROR: "Days for take a break can be in range 1 to 30",
  TIME_LIMIT_ERROR: "Session Time can be set between 1 to 24",
  KYC_ERROR: "Your KYC status is not APPROVED, you cannot perform this action",
  BONUS_VALIDITY: "You can activate this bonus on or after ",
  LANGUAGE_NOT_ALLOWED: "This language is not allowed",
};

export const ERROR_CODE = {
  TRANSACTION_FAILED: 101,
};
