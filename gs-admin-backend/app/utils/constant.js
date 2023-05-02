import config from "../../config/app";

export const RESPONSIBLE_GAMING_ENDPOINTS = [
  "set-daily-limit",
  "set-loss-limit",
  "set-deposit-limit",
  "set-disable-until",
  "set-session-time",
];

export const ROLE = {
  SUPERADMIN: "superadmin",
  ADMIN: "manager",
  SUPPORT: "support",
  USER: "user",
};

export const ROLE_ID = {
  SUPERADMIN: 1,
  ADMIN: 2,
  SUPPORT: 3,
};

export const BREAK_TYPE = {
  TAKE_A_BREAK: "TAKE_A_BREAK",
  SELF_EXCLUSION: "SELF_EXCLUSION",
};

export const SELF_EXCLUSION_TYPE = {
  CURRENT: "current",
  ALL: "all",
};

export const REQUEST_TYPE = {
  GET: "R",
  POST: "C",
  PUT: "U",
  DELETE: "D",
  TOGGLE: "T",
  APPLY_THEME: "A",
  CREATE_CUSTOM: "CC",
  ADD_BALANCE: "AB",
  SET_RESET: "SR",
  TEST_EMAIL: "TE",
  BONUS: "Issue",
};

export const PERMISSION_TYPE = {
  Dashboard: "Dashboard",
  Currencies: "Currencies",
  Admins: "Admins",
  CMS: "CMS",
  Credentials: "Credentials",
  Configurations: "Configurations",
  Users: "Users",
  Transactions: "Transactions",
  Bonus: "Bonus",
  WageringTemplate: "WageringTemplate",
  KycLabel: "KycLabel",
  RestrictedCountry: "RestrictedCountry",
  CasinoManagement: "CasinoManagement",
  RegistrationField: "RegistrationField",
  LivePlayerReport: "LivePlayerReport",
  PlayerStatisticsReport: "PlayerManagementReport",
  PlayerLiabilityReport: "PlayerLiabilityReport",
  KpiSummaryReport: "KpiSummaryReport",
  KpiReport: "KpiReport",
  GameReport: "GameReport",
  Settings: "Settings",
  LoyaltyProgram: "LoyaltyProgram",
  EmailTemplate: "EmailTemplate",
  ImageGallery: "ImageGallery",
  aliases: {
    // Currencies
    "get-currencies": "Currencies",
    "get-currency-details": "Currencies",
    "create-currency": "Currencies",
    "update-currency": "Currencies",
    // Admins
    "get-superadmins": "Admins",
    "superadmin-details": "Admins",
    "create-superadmin-user": "Admins",
    "update-superadmin-user": "Admins",
    "get-admin-users": "Admins",
    "create-admin-user": "Admins",
    "update-admin-details": "Admins",
    // CMS
    "get-cms": "CMS",
    "update-cms": "CMS",
    "create-cms": "CMS",
    "get-cms-details": "CMS",
    "cms-dynamic-data": "CMS",
    "delete-cms-language": "CMS",
    // credentials
    "create-credential": "Credentials",
    "update-credential": "Credentials",
    // Users
    "get-users": "Users",
    "get-user": "Users",
    "update-user": "Users",
    "get-user-document": "Users",
    "verify-user-document": "Users",
    "add-balance": "Users",
    "request-document": "Users",
    "cancel-document-request": "Users",
    "get-tags": "Users",
    "add-tags": "Users",
    "set-daily-limit": "Users",
    "set-loss-limit": "Users",
    "set-deposit-limit": "Users",
    "set-disable-until": "Users",
    "set-session-time": "Users",
    // Bonus
    "create-bonus": "Bonus",
    "update-bonus": "Bonus",
    "get-bonus": "Bonus",
    "get-bonus-detail": "Bonus",
    "get-freespin-games": "Bonus",
    "delete-bonus": "Bonus",
    "issue-bonus": "Bonus",
    "cancel-bonus": "Bonus",
    "get-user-bonus": "Bonus",
    // Kyc Label
    "create-document-label": "KycLabel",
    "get-document-label": "KycLabel",
    "update-document-label": "KycLabel",
    // Live Player Report
    "get-live-player-report": "LivePlayerReport",
    // Demograph Report
    "get-demographic-report": "DemographReport",
    // Player Management Report
    "get-top-players": "PlayerStatisticsReport",
    // Player Liability Report
    "get-players-liability": "PlayerLiabilityReport",
    // Kpi Summary Report
    "get-kpi-summary": "KpiSummaryReport",
    // Kpi Report
    "get-kpi-report": "KpiReport",
    // Game Report
    "get-game-report": "GameReport",
    // RestrictedCountry
    "update-restricted-items": "RestrictedCountry",
    "delete-restricted-items": "RestrictedCountry",
    "get-restricted-items": "RestrictedCountry",
    "get-unrestricted-items": "RestrictedCountry",
    // CasinoManagement
    "get-all-providers": "CasinoManagement",
    "create-casino-provider": "CasinoManagement",
    "update-casino-provider": "CasinoManagement",
    "get-casino-providers": "CasinoManagement",
    "get-aggregators": "CasinoManagement",
    "add-aggregator": "CasinoManagement",
    "create-casino-category": "CasinoManagement",
    "get-all-casino-category": "CasinoManagement",
    "update-casino-category": "CasinoManagement",
    "update-master-game-category": "CasinoManagement",
    "create-casino-sub-category": "CasinoManagement",
    "get-all-casino-sub-category": "CasinoManagement",
    "get-casino-sub-category": "CasinoManagement",
    "update-casino-sub-category": "CasinoManagement",
    "update-master-game-sub-category": "CasinoManagement",
    "create-casino-game": "CasinoManagement",
    "update-casino-game": "CasinoManagement",
    "get-casino-games": "CasinoManagement",
    "get-all-casino-games": "CasinoManagement",
    "create-category-game": "CasinoManagement",
    "update-category-game": "CasinoManagement",
    "get-category-games": "CasinoManagement",
    "delete-category-game": "CasinoManagement",
    "order-casino-category": "CasinoManagement",
    "order-casino-sub-category": "CasinoManagement",
    "order-category-games": "CasinoManagement",
    "delete-casino-sub-category": "CasinoManagement",
    "delete-casino-category": "CasinoManagement",
    "get-restricted-countries": "CasinoManagement",
    "get-unrestricted-countries": "CasinoManagement",
    "update-restricted-country": "CasinoManagement",
    "delete-restricted-countries": "CasinoManagement",
    // Transactions
    "get-transactions": "Transactions",
    "get-casino-transactions": "Transactions",
    "get-all-withdraw-request": "Transactions",
    "get-transaction-users": "Transactions",
    // RegistrationField
    "get-global-registration": "RegistrationField",
    "update-global-registration": "RegistrationField",
    // Settings
    "get-theme-setting": "Settings",
    "update-theme-setting": "Settings",
    "create-credential": "Settings",
    "update-credential": "Settings",
    "get-credentials": "Settings",
    "get-credential-by-key": "Settings",
    "get-all-credentials-keys": "Settings",
    // LoyaltyProgram
    "get-loyalty-level": "LoyaltyProgram",
    "update-loyalty-level": "LoyaltyProgram",
    // Email-template
    "get-all-email-templates": "EmailTemplate",
    "get-email-template": "EmailTemplate",
    "update-email-template": "EmailTemplate",
    "test-email-template": "EmailTemplate",
    "delete-email-template": "EmailTemplate",
    "mark-email-primary": "EmailTemplate",
    "create-email-template": "EmailTemplate",
    "email-dynamic-data": "EmailTemplate",
    "delete-email-template-language": "EmailTemplate",
    // ImageGallery
    "get-image-gallery": "ImageGallery",
    "upload-to-gallery": "ImageGallery",
    "delete-gallery-image": "ImageGallery",
    // update-status
    ADMIN: "Site",
    SITE: "Site",
    SUPERADMIN: "Admins",
    USER: "Users",
    CMS: "CMS",
    BONUS: "Bonus",
    CASINOMANAGEMENT: "CasinoManagement",
  },
};

export const TEST_EMAIL = "test-email-template";
export const MANAGE_MONEY = "add-balance";

// T here is Toggle Status, SR here is set reset Responsible gaming limits, AB: add balance
export const SUPERADMIN_PERMISSION = {
  Currencies: ["C", "R", "U", "T", "D"],
  Admins: ["C", "R", "U", "T"],
  CMS: ["C", "R", "U", "T", "D"],
  Credentials: ["C", "R", "U"],
  Configurations: ["C", "R", "U", "T", "D"],
  Users: ["R", "U", "SR", "AB"],
  Transactions: ["C", "R", "U", "T", "D"],
  WageringTemplate: ["C", "R", "U", "T", "D"],
  KycLabel: ["C", "R", "U", "T", "D"],
  RestrictedCountry: ["C", "R", "U", "T", "D"],
  CasinoManagement: ["C", "R", "U", "T"],
  RegistrationField: ["C", "R", "U", "T", "D"],
  LivePlayerReport: ["C", "R", "U", "T", "D"],
  PlayerStatisticsReport: ["C", "R", "U", "T", "D"],
  PlayerLiabilityReport: ["C", "R", "U", "T", "D"],
  KpiSummaryReport: ["C", "R", "U", "T", "D"],
  KpiReport: ["C", "R", "U", "T", "D"],
  GameReport: ["C", "R", "U", "T", "D"],
  Bonus: ["C", "R", "U", "T", "Issue"],
  LoyaltyProgram: ["C", "R", "U", "T", "D"],
  EmailTemplate: ["R", "U", "TE", "D"],
  ImageGallery: ["R", "U", "D"],
};

export const TOGGLE_CASE = {
  ADMIN: "ADMIN",
  SITE: "SITE",
  SUPERADMIN: "SUPERADMIN",
  AFFILIATE: "AFFILIATE",
  USER: "USER",
  CMS: "CMS",
  CASINO_CATEGORY: "CASINO_CATEGORY",
  CASINO_SUB_CATEGORY: "CASINO_SUB_CATEGORY",
  CATEGORY_GAME: "CATEGORY_GAME",
  CASINO_GAME: "CASINO_GAME",
  CASINO_PROVIDER: "CASINO_PROVIDER",
  AGGREGATOR: "AGGREGATOR",
  BONUS: "BONUS",
  LANGUAGE: "LANGUAGE",
};

export const CASINO_TOGGLE_CASE = [
  "CATEGORY_GAME",
  "CASINO_CATEGORY",
  "CASINO_SUB_CATEGORY",
  "CASINO_GAME",
  "CASINO_PROVIDER",
  "AGGREGATOR",
];

export const STATUS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
  CANCELLED: 3,
  REREQUESTED: 4,
};

export const STATUS_VALUE = {
  APPROVED: "APPROVED",
  PENDING: "PENDING",
  REJECTED: "REJECTED",
  REQUESTED: "REQUESTED",
  RE_REQUESTED: "RE-REQUESTED",
};

export const UPLOAD_FILE_SIZE = 1000000;
export const OK = "ok";

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

export const TRANSACTION_TYPE = {
  DEPOSIT: "deposit",
  WITHDRAW: "withdraw",
  BONUS: "bonus",
  ADD_BALANCE: "addMoney",
  REMOVE_BALANCE: "removeMoney",
};

export const GAME_CATEGORY = {
  TABLE_GAME: "table",
  CASINO_GAME: "casino",
};

export const RESTRICTED_TYPE = {
  PROVIDERS: "PROVIDERS",
  GAMES: "GAMES",
};

export const EMAIL_SUBJECTS = {
  verification: "Verify Your Account",
  userActivate: "Account Activation",
  userDeactivate: "Account Deactivated",
  kycRejected: "Kyc Rejected - Action required",
  kycVerified: "Congratulation Your Kyc Has Been Approved",
  kycApproved: "Document Approved",
  kycRequested: "Document Requested for KYC",
};

export const ACTION = {
  WIN: "win",
  BET: "bet",
  ROLLBACK: "rollback",
  ROLLBACKBEFOREBETWIN: "prerollback",
  FREESPINS: "freespins",
};

export const CASINO_TRANSACTION_STATUS = {
  PENDING: 0,
  COMPLETED: 1,
  FAILED: 2,
  ROLLBACK: 3,
};

export const AMOUNT_TYPE = {
  CASH: 0,
  NON_CASH: 1,
  CASH_NON_CASH: 2,
};

export const BONUS_TYPE = {
  JOINING: "joining",
  FREESPINS: "freespins",
  DEPOSIT: "deposit",
  aliases: {
    freespins: "FREESPINS",
  },
};

export const WAGERING_TYPE = {
  BONUS: "bonus",
  BONUSDEPOSIT: "bonusdeposit",
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
};

export const WAGER_STATUS = {
  PENDING: "PENDING",
  STARTED: "STARTED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

export const KEYS = {
  MAX_BONUS_THRESHOLD: "maxBonusThreshold",
  MIN_DEPOSIT: "minDeposit",
  MAX_WIN_AMOUNT: "maxWinAmount",
  ZERO_OUT_THRESHOLD: "zeroOutThreshold",
  MIN_BALANCE: "minBalance",
};

export const TIME_PERIOD = {
  DAILY: 1,
  WEEKLY: 7,
  MONTHLY: 30,
};

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

export const REPORTING_CURRENCY = "EUR";
export const MAX_QUANTITY = 100;
export const ACCOUNT_TYPE = "REAL";

export const adminBaseUrl = [
  config.get("webApp.baseUrl"),
  config.get("webApp.baseUrlAlter"),
  config.get("webApp.adminDomain"),
];
export const superadminBaseUrl = [
  config.get("webApp.baseUrl"),
  config.get("webApp.baseUrlAlter"),
  config.get("webApp.superadminDomain"),
];

export const COUNTRY_CURRENCY_MAPPER = {
  BD: "BDT",
  BE: "EUR",
  BF: "XOF",
  BG: "BGN",
  BA: "BAM",
  BB: "BBD",
  WF: "XPF",
  BL: "EUR",
  BM: "BMD",
  BN: "BND",
  BO: "BOB",
  BH: "BHD",
  BI: "BIF",
  BJ: "XOF",
  BT: "BTN",
  JM: "JMD",
  BV: "NOK",
  BW: "BWP",
  WS: "WST",
  BQ: "USD",
  BR: "BRL",
  BS: "BSD",
  JE: "GBP",
  BY: "BYR",
  BZ: "BZD",
  RU: "RUB",
  RW: "RWF",
  RS: "RSD",
  TL: "USD",
  RE: "EUR",
  TM: "TMT",
  TJ: "TJS",
  RO: "RON",
  TK: "NZD",
  GW: "XOF",
  GU: "USD",
  GT: "GTQ",
  GS: "GBP",
  GR: "EUR",
  GQ: "XAF",
  GP: "EUR",
  JP: "JPY",
  GY: "GYD",
  GG: "GBP",
  GF: "EUR",
  GE: "GEL",
  GD: "XCD",
  GB: "GBP",
  GA: "XAF",
  SV: "USD",
  GN: "GNF",
  GM: "GMD",
  GL: "DKK",
  GI: "GIP",
  GH: "GHS",
  OM: "OMR",
  TN: "TND",
  JO: "JOD",
  HR: "HRK",
  HT: "HTG",
  HU: "HUF",
  HK: "HKD",
  HN: "HNL",
  HM: "AUD",
  VE: "VEF",
  PR: "USD",
  PS: "ILS",
  PW: "USD",
  PT: "EUR",
  SJ: "NOK",
  PY: "PYG",
  IQ: "IQD",
  PA: "PAB",
  PF: "XPF",
  PG: "PGK",
  PE: "PEN",
  PK: "PKR",
  PH: "PHP",
  PN: "NZD",
  PL: "PLN",
  PM: "EUR",
  ZM: "ZMK",
  EH: "MAD",
  EE: "EUR",
  EG: "EGP",
  ZA: "ZAR",
  EC: "USD",
  IT: "EUR",
  VN: "VND",
  SB: "SBD",
  ET: "ETB",
  SO: "SOS",
  ZW: "ZWL",
  SA: "SAR",
  ES: "EUR",
  ER: "ERN",
  ME: "EUR",
  MD: "MDL",
  MG: "MGA",
  MF: "EUR",
  MA: "MAD",
  MC: "EUR",
  UZ: "UZS",
  MM: "MMK",
  ML: "XOF",
  MO: "MOP",
  MN: "MNT",
  MH: "USD",
  MK: "MKD",
  MU: "MUR",
  MT: "EUR",
  MW: "MWK",
  MV: "MVR",
  MQ: "EUR",
  MP: "USD",
  MS: "XCD",
  MR: "MRO",
  IM: "GBP",
  UG: "UGX",
  TZ: "TZS",
  MY: "MYR",
  MX: "MXN",
  IL: "ILS",
  FR: "EUR",
  IO: "USD",
  SH: "SHP",
  FI: "EUR",
  FJ: "FJD",
  FK: "FKP",
  FM: "USD",
  FO: "DKK",
  NI: "NIO",
  NL: "EUR",
  NO: "NOK",
  NA: "NAD",
  VU: "VUV",
  NC: "XPF",
  NE: "XOF",
  NF: "AUD",
  NG: "NGN",
  NZ: "NZD",
  NP: "NPR",
  NR: "AUD",
  NU: "NZD",
  CK: "NZD",
  XK: "EUR",
  CI: "XOF",
  CH: "CHF",
  CO: "COP",
  CN: "CNY",
  CM: "XAF",
  CL: "CLP",
  CC: "AUD",
  CA: "CAD",
  CG: "XAF",
  CF: "XAF",
  CD: "CDF",
  CZ: "CZK",
  CY: "EUR",
  CX: "AUD",
  CR: "CRC",
  CW: "ANG",
  CV: "CVE",
  CU: "CUP",
  SZ: "SZL",
  SY: "SYP",
  SX: "ANG",
  KG: "KGS",
  KE: "KES",
  SS: "SSP",
  SR: "SRD",
  KI: "AUD",
  KH: "KHR",
  KN: "XCD",
  KM: "KMF",
  ST: "STD",
  SK: "EUR",
  KR: "KRW",
  SI: "EUR",
  KP: "KPW",
  KW: "KWD",
  SN: "XOF",
  SM: "EUR",
  SL: "SLL",
  SC: "SCR",
  KZ: "KZT",
  KY: "KYD",
  SG: "SGD",
  SE: "SEK",
  SD: "SDG",
  DO: "DOP",
  DM: "XCD",
  DJ: "DJF",
  DK: "DKK",
  VG: "USD",
  DE: "EUR",
  YE: "YER",
  DZ: "DZD",
  US: "USD",
  UY: "UYU",
  YT: "EUR",
  UM: "USD",
  LB: "LBP",
  LC: "XCD",
  LA: "LAK",
  TV: "AUD",
  TW: "TWD",
  TT: "TTD",
  TR: "TRY",
  LK: "LKR",
  LI: "CHF",
  LV: "EUR",
  TO: "TOP",
  LT: "LTL",
  LU: "EUR",
  LR: "LRD",
  LS: "LSL",
  TH: "THB",
  TF: "EUR",
  TG: "XOF",
  TD: "XAF",
  TC: "USD",
  LY: "LYD",
  VA: "EUR",
  VC: "XCD",
  AE: "AED",
  AD: "EUR",
  AG: "XCD",
  AF: "AFN",
  AI: "XCD",
  VI: "USD",
  IS: "ISK",
  IR: "IRR",
  AM: "AMD",
  AL: "ALL",
  AO: "AOA",
  AQ: "",
  AS: "USD",
  AR: "ARS",
  AU: "AUD",
  AT: "EUR",
  AW: "AWG",
  IN: "INR",
  AX: "EUR",
  AZ: "AZN",
  IE: "EUR",
  ID: "IDR",
  UA: "UAH",
  QA: "QAR",
  MZ: "MZN",
};

export const LIMIT_TIME_PERIOD = {
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
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
  "SiteName",
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
    required: ["kycLabels", "reason"],
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
  5: {
    required: [],
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
  6: {
    required: ["kycLabels"],
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
  7: {
    required: [],
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
  8: {
    required: [],
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
  9: {
    required: ["kycLabels"],
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
  {
    key: "siteLoginUrl",
    description: "This will be replaced by user login route",
  },
  {
    key: "playerCurrencySymbol",
    description: "This will be replaced by user's currency symbol",
  },
  {
    key: "sendSupportRequestRoute",
    description:
      "This will be replaced by route for compose support email page.",
  },
];

export const BONUS_ACTIONS = ["cancel-bonus", "issue-bonus"];

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

export const LEVEL = 1;

export const BANNER_KEYS = [
  "homeBanner",
  "homeBackground",
  "loyaltyBanner",
  "loyaltyBackground",
  "promotionsBanner",
  "promotionsBackground",
  "casinoBanner",
  "casinoBackground",
];