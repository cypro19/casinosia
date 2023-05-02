import CryptoJS from "crypto-js";
import config from "../../config/app";

export const ROLE = {
  USER: "user",
  ADMIN: "admin",
  MERCHANT: "merchant",
  SUPERADMIN: "superadmin",
};

export const TYPE = {
  CRYPTO: "CRYPTO",
  FIAT: "FIAT",
  CRYPTO_ID: 0,
  FIAT_ID: 1,
};

export const TRANSACTION_STATUS = {
  PENDING: 0,
  SUCCESS: 1,
  CANCELLED: 2,
  FAILED: 3,
  ROLLBACK: 4,
  APPROVED: 5,
  REJECTED: 6,
};

export const TRANSACTION_STATUS_CASINO = {
  PENDING: 0,
  COMPLETED: 1,
  FAILED: 2,
  ROLLBACK: 3,
};

export const MAP_AGGREGATOR = {
  softswiss: "swissSoft",
  amantic: "amantic",
};

export const MAP_GENDER = {
  Female: "f",
  Male: "m",
  F: "f",
  M: "m",
  "Not to say": "m",
  Other: "m",
};

export const EMAIL_SUBJECTS = {
  verification: "Verify your account",
  reset: "Reset your Password",
  registration_welcome: "welcome",
  deposit_success: "Amount Deposited Successfully",
  deposit_failed: "Deposit Failed",
  withdraw_request_received: "Withdraw Request Received",
  withdraw_request_approved: "Withdraw Request Approved",
  withdraw_request_processed: "Withdraw Request Processed",
  kycReceived: "KYC Received",
};

export const OK = "ok";
export const LIMIT = 10;
export const SUCCESS = "success";
export const UPLOAD_FILE_SIZE = 1000000;
export const UPLOAD_DOCUMENT_SIZE = 2000000;
export const LEVEL = 1;

export const FREE_SPINS = {
  ACTIVE: "active",
  EXPIRED: "expired",
  PLAYED: "played",
  CANCELLED: "cancelled",
};

export const BONUS_TYPE = {
  JOINING: "joining",
  FREESPINS: "freespins",
  DEPOSIT: "deposit",
  aliases: {
    freespins: "FREESPINS",
  },
};

export const ACTION = {
  WIN: "win",
  BET: "bet",
  ROLLBACK: "rollback",
  ROLLBACKBEFOREBETWIN: "prerollback",
  FREESPINS: "freespins",
  BETINTERNAL: "betInternal",
  WININTERNAL: "winInternal",
};

export const TRANSACTION_TYPE = {
  DEPOSIT: "deposit",
  WITHDRAW: "withdraw",
  BONUS: "bonus",
  BONUS_TO_CASH: "bonusToCash",
  FORFEIT: "bonusForfeit",
  EXPIRED: "bonusExpired",
  ADD_BALANCE: "addMoney",
  REMOVE_BALANCE: "removeMoney",
};

export const AMOUNT_TYPE = {
  CASH: 0,
  NON_CASH: 1,
  CASH_NON_CASH: 2,
};

export const ID = parseInt(
  CryptoJS.AES.decrypt(
    config.get("paymentIq.merchantId"),
    config.get("jwt.secretKey")
  ).toString(CryptoJS.enc.Utf8)
);

export const WEB_SOCKET_CODE = {
  UPDATEWALLET: "UPDATEWALLET",
};

export const STATUS_VALUE = {
  APPROVED: "APPROVED",
  PENDING: "PENDING",
  REJECTED: "REJECTED",
  REQUESTED: "REQUESTED",
  RE_REQUESTED: "RE-REQUESTED",
};

export const STATUS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
  CANCELLED: 3,
  REREQUESTED: 4,
};

export const BONUS_STATUS = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  CANCELLED: "CANCELLED",
  FORFEIT: "FORFEITED",
  EXPIRED: "EXPIRED",
  CLAIMING: "CLAIMING",
  IN_PROCESS: "IN-PROCESS",
  LAPSED: "LAPSED",
  COMPLETED: "COMPLETED",
};

export const WAGERING_TYPE = {
  BONUS: "bonus",
  BONUSDEPOSIT: "bonusdeposit",
};

export const KEYS = {
  MAX_BONUS_THRESHOLD: "maxBonusThreshold",
  MIN_DEPOSIT: "minDeposit",
  MAX_WIN_AMOUNT: "maxWinAmount",
  ZERO_OUT_THRESHOLD: "zeroOutThreshold",
  MIN_BALANCE: "minBalance",
};

export const WAGER_STATUS = {
  PENDING: "PENDING",
  STARTED: "STARTED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

export const TIME_PERIOD = {
  DAILY: 1,
  WEEKLY: 7,
  MONTHLY: 30,
};

export const BREAK_TYPE = {
  TAKE_A_BREAK: "TAKE_A_BREAK",
  SELF_EXCLUSION: "SELF_EXCLUSION",
};

export const SELF_EXCLUSION_TYPE = {
  CURRENT: "current",
};

export const EMAIL_TEMPLATE_PRIMARY_STATUS = {
  PRIMARY: 1,
  DISABLE: 0,
  alias: {
    0: "disable",
    1: "primary",
  },
};

export const EMAIL_TEMPLATE_TYPES = {
  ACTIVE_USER: "Active User",
  IN_ACTIVE_USER: "In-Active User",
  EMAIL_VERIFICATION: "Email Verification",
  RESET_PASSWORD: "Reset Password",
  KYC_REJECTED: "KYC Rejected",
  KYC_VERIFIED: "KYC Verified",
  KYC_REQUESTED: "KYC Requested",
  KYC_REMINDER: "KYC Reminder",
  KYC_RECEIVED: "KYC Received",
  KYC_APPROVED: "KYC Approved",
  WITHDRAW_REQUEST_RECEIVED: "Withdraw Request Received",
  WITHDRAW_APPROVED: "Withdraw Approved",
  WITHDRAW_PROCESSED: "Withdraw Processed",
  DEPOSIT_SUCCESS: "Deposit Success",
  DEPOSIT_FAILED: "Deposit Failed",
  REGISTRATION_WELCOME: "Registration Welcome",
  GAMBLING_STATUS_REGISTRATION: "Gambling Status Registration",
  VALUE_T0_INT: {
    "Active User": 0,
    "In-Active User": 1,
    "Email Verification": 2,
    "Reset Password": 3,
    "KYC Rejected": 4,
    "KYC Verified": 5,
    "KYC Requested": 6,
    "KYC Reminder": 7,
    "KYC Received": 8,
    "KYC Approved": 9,
    "Withdraw Request Received": 10,
    "Withdraw Approved": 11,
    "Withdraw Processed": 12,
    "Deposit Success": 13,
    "Deposit Failed": 14,
    "Registration Welcome": 15,
    "Gambling Status Registration": 16,
  },
  INT_TO_VALUE: {
    0: "Active User",
    1: "In-Active User",
    2: "Email Verification",
    3: "Reset Password",
    4: "KYC Rejected",
    5: "KYC Verified",
    6: "KYC Requested",
    7: "KYC Reminder",
    8: "KYC Received",
    9: "KYC Approved",
    10: "Withdraw Request Received",
    11: "Withdraw Approved",
    12: "Withdraw Processed",
    13: "Deposit Success",
    14: "Deposit Failed",
    15: "Registration Welcome",
    16: "Gambling Status Registration",
  },
};

export const EMAIL_TEMPLATE_ORDER = [
  "Email Verification",
  "Registration Welcome",
  "Reset Password",
  "Active User",
  "In-Active User",
  "KYC Verified",
  "KYC Rejected",
  "KYC Requested",
  "KYC Reminder",
  "KYC Received",
  "KYC Approved",
  "Withdraw Request Received",
  "Withdraw Approved",
  "Withdraw Processed",
  "Deposit Success",
  "Deposit Failed",
  "Gambling Status Registration",
];

export const EMAIL_ALLOWED_KEYS = [
  "siteName",
  "siteLogo",
  "subject",
  "userName",
  "walletAmountTotal",
  "walletAmountBonus",
  "walletAmountReal",
  "siteUrl",
  "reason",
  "link",
  "withdrawAmount",
  "depositAmount",
  "transactionId",
  "playerEmail",
  "playerFullName",
  "playerFirstName",
  "playerLastName",
  "supportEmailAddress",
  "kycLabels",
  "siteLoginUrl",
  "playerCurrencySymbol",
  "sendSupportRequestRoute",
];

export const EMAIL_TEMPLATES_KEYS = {
  0: {
    required: ["siteName", "siteUrl", "siteLogo"],
    optional: [
      "userName",
      "walletAmountTotal",
      "walletAmountBonus",
      "walletAmountReal",
    ],
  },
  1: {
    required: ["siteName", "siteUrl", "siteLogo", "reason"],
    optional: [
      "userName",
      "walletAmountTotal",
      "walletAmountBonus",
      "walletAmountReal",
    ],
  },
  2: {
    required: ["link", "userName", "playerEmail"],
    optional: [
      "siteName",
      "siteUrl",
      "siteLogo",
      "walletAmountTotal",
      "walletAmountBonus",
      "walletAmountReal",
      "playerFullName",
      "playerFirstName",
      "playerLastName",
      "supportEmailAddress",
    ],
  },
  3: {
    required: ["link"],
    optional: [
      "siteName",
      "siteLogo",
      "userName",
      "walletAmountTotal",
      "walletAmountBonus",
      "walletAmountReal",
      "siteUrl",
      "playerEmail",
      "playerFullName",
      "playerFirstName",
      "playerLastName",
      "supportEmailAddress",
      "siteLoginUrl",
      "playerCurrencySymbol",
    ],
  },
  4: {
    required: ["siteName", "siteUrl", "siteLogo", "userName", "reason"],
    optional: ["walletAmountTotal", "walletAmountBonus", "walletAmountReal"],
  },
  5: {
    required: ["siteName", "siteUrl", "siteLogo", "userName"],
    optional: ["walletAmountTotal", "walletAmountBonus", "walletAmountReal"],
  },
  6: {
    required: ["siteName", "siteUrl", "siteLogo", "userName"],
    optional: ["walletAmountTotal", "walletAmountBonus", "walletAmountReal"],
  },
  7: {
    required: ["siteName", "siteUrl", "siteLogo", "userName"],
    optional: ["walletAmountTotal", "walletAmountBonus", "walletAmountReal"],
  },
  8: {
    required: ["siteName", "siteUrl", "siteLogo", "userName"],
    optional: ["walletAmountTotal", "walletAmountBonus", "walletAmountReal"],
  },
  9: {
    required: ["siteName", "siteUrl", "siteLogo", "userName"],
    optional: ["walletAmountTotal", "walletAmountBonus", "walletAmountReal"],
  },
  10: {
    required: ["withdrawAmount", "playerCurrencySymbol"],
    optional: [
      "siteName",
      "siteLogo",
      "userName",
      "walletAmountTotal",
      "walletAmountBonus",
      "walletAmountReal",
      "siteUrl",
      "playerEmail",
      "playerFullName",
      "playerFirstName",
      "playerLastName",
      "supportEmailAddress",
      "siteLoginUrl",
      "playerCurrencySymbol",
      "sendSupportRequestRoute",
    ],
  },
  11: {
    required: ["withdrawAmount", "playerCurrencySymbol"],
    optional: [
      "siteName",
      "siteLogo",
      "userName",
      "walletAmountTotal",
      "walletAmountBonus",
      "walletAmountReal",
      "siteUrl",
      "playerEmail",
      "playerFullName",
      "playerFirstName",
      "playerLastName",
      "supportEmailAddress",
      "siteLoginUrl",
      "playerCurrencySymbol",
      "sendSupportRequestRoute",
    ],
  },
  12: {
    required: ["withdrawAmount", "playerCurrencySymbol", "transactionId"],
    optional: [
      "siteName",
      "siteLogo",
      "userName",
      "walletAmountTotal",
      "walletAmountBonus",
      "walletAmountReal",
      "siteUrl",
      "playerEmail",
      "playerFullName",
      "playerFirstName",
      "playerLastName",
      "supportEmailAddress",
      "siteLoginUrl",
      "playerCurrencySymbol",
      "sendSupportRequestRoute",
    ],
  },
  13: {
    required: ["transactionId", "playerCurrencySymbol", "depositAmount"],
    optional: [
      "siteName",
      "siteLogo",
      "userName",
      "walletAmountTotal",
      "walletAmountBonus",
      "walletAmountReal",
      "siteUrl",
      "playerEmail",
      "playerFullName",
      "playerFirstName",
      "playerLastName",
      "supportEmailAddress",
      "siteLoginUrl",
      "sendSupportRequestRoute",
      "playerCurrencySymbol",
    ],
  },
  14: {
    required: [
      "transactionId",
      "subject",
      "playerCurrencySymbol",
      "depositAmount",
    ],
    optional: [
      "siteName",
      "siteLogo",
      "userName",
      "walletAmountTotal",
      "walletAmountBonus",
      "walletAmountReal",
      "siteUrl",
      "playerEmail",
      "playerFullName",
      "playerFirstName",
      "playerLastName",
      "supportEmailAddress",
      "siteLoginUrl",
      "playerCurrencySymbol",
      "sendSupportRequestRoute",
    ],
  },
  15: {
    required: ["playerFullName", "siteLoginUrl", "userName"],
    optional: [
      "siteName",
      "siteLogo",
      "walletAmountTotal",
      "walletAmountBonus",
      "walletAmountReal",
      "siteUrl",
      "playerEmail",
      "playerFullName",
      "playerFirstName",
      "playerLastName",
      "supportEmailAddress",
      "siteLoginUrl",
      "playerCurrencySymbol",
      "sendSupportRequestRoute",
    ],
  },
  16: {
    required: ["supportEmailAddress", "sendSupportRequestRoute"],
    optional: [
      "siteName",
      "siteLogo",
      "userName",
      "walletAmountTotal",
      "walletAmountBonus",
      "walletAmountReal",
      "siteUrl",
      "playerEmail",
      "playerFullName",
      "playerFirstName",
      "playerLastName",
      "siteLoginUrl",
      "playerCurrencySymbol",
    ],
  },
};

export const EMAIL_DYNAMIC_OPTIONS = [
  {
    key: "siteName",
    description: "This will be replaced by site name",
  },
  {
    key: "siteLogo",
    description: "This will be replaced by site's Logo URL",
  },
  {
    key: "subject",
    description: "If not given, default subject line will be used",
  },
  {
    key: "userName",
    description: "This will be replaced by User's unique username",
  },
  {
    key: "walletAmountTotal",
    description: "This will be replaced by User's total wallet amount",
  },
  {
    key: "walletAmountBonus",
    description: "This will be replaced by User's non-cash wallet amount",
  },
  {
    key: "walletAmountReal",
    description: "This will be replaced by User's cash wallet amount",
  },
  {
    key: "siteUrl",
    description: "This will be replaced by site's URL",
  },
  {
    key: "reason",
    description: "This will be replaced by valid reason for triggering email",
  },
  {
    key: "link",
    description:
      "Dynamically generated link from backend (Reset Password, Email Confirmation)",
  },
  {
    key: "withdrawAmount",
    description: "This will be replaced by withdraw request amount",
  },
  {
    key: "depositAmount",
    description: "This will be replaced by deposit amount",
  },
  {
    key: "transactionId",
    description:
      "This will be replaced by transaction Id for (Deposit / Withdraw)",
  },
  {
    key: "playerEmail",
    description: "This will be replaced by player's email address",
  },
  {
    key: "playerFullName",
    description:
      "This will be replaced by player's full name (first name + last name)",
  },
  {
    key: "playerFirstName",
    description: "This will be replaced by player's first name",
  },
  {
    key: "playerLastName",
    description: "This will be replaced by player's last name",
  },
  {
    key: "supportEmailAddress",
    description: "This will be replaced by support email address",
  },
  {
    key: "kycLabels",
    description:
      "This will be replaced by kyc label for pending, approved, rejected",
  },
];

export const LIMIT_TIME_PERIOD = {
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
};

export const ACCOUNT_TYPE = "REAL";

export const CMS_ALLOWED_KEYS = ["siteName", "siteLogo", "supportEmailAddress"];

export const CMS_DYNAMIC_OPTIONS = [
  {
    key: "siteName",
    description: "This will be replaced by site name",
  },
  {
    key: "siteLogo",
    description: "This will be replaced by site's Logo URL",
  },
  {
    key: "supportEmailAddress",
    description: "This will be replaced by support email address",
  },
];

export const STRICTLY_REQUIRED_REGISTRATION_FIELDS = [
  "email",
  "password",
  "firstName",
  "username",
  "lastName",
  "dateOfBirth",
  "address",
  "gender",
  "countryCode",
  "currencyCode",
];

export const DEFAULT_LANGUAGE = "EN";
