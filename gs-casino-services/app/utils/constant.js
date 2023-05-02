export const ROLE = {
  USER: "user",
  ADMIN: "admin",
};

export const STATUS = {
  PENDING: 0,
  APPROVED: 1,
  FAILED: 2,
};

export const TYPE = {
  CRYPTO: "CRYPTO",
  FIAT: "FIAT",
  CRYPTO_ID: 0,
  FIAT_ID: 1,
};

export const ACTION = {
  WIN: "win",
  BET: "bet",
  ROLLBACK: "rollback",
  ROLLBACK_BEFORE_BET_WIN: "prerollback",
  FREE_SPINS: "freespins",
  PRE_WIN: "prewin",
};

export const TRANSACTION_STATUS = {
  PENDING: 0,
  COMPLETED: 1,
  FAILED: 2,
  ROLLBACK: 3,
};

export const FREE_SPINS = {
  ACTIVE: "active",
  EXPIRED: "expired",
  PLAYED: "played",
  CANCELLED: "cancelled",
};

export const AMOUNT_TYPE = {
  CASH: 0,
  NON_CASH: 1,
  CASH_NON_CASH: 2,
};

export const BONUS_TYPE = {
  FREESPINS: "freespins",
  DEPOSIT: "deposit",
};

export const BONUS_STATUS = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  CANCELLED: "CANCELLED",
  FORFEIT: "FORFEITED",
  EXPIRED: "EXPIRED",
  COMPLETED: "COMPLETED",
  ZEROED_OUT: "ZEROED-OUT",
};

export const WAGER_STATUS = {
  PENDING: "PENDING",
  STARTED: "STARTED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

export const STATUS_VALUE = {
  APPROVED: "APPROVED",
  PENDING: "PENDING",
  REJECTED: "REJECTED",
};

export const WAGERING_TYPE = {
  BONUSDEPOSIT: "bonusdeposit",
};

export const TRANSACTION_TYPE = {
  DEPOSIT: "deposit",
  WITHDRAW: "withdraw",
  BONUS: "bonus",
  BONUS_TO_CASH: "bonusToCash",
  ZEROED_OUT: "bonusZeroedOut",
};

export const KEYS = {
  MAX_BONUS_THRESHOLD: "maxBonusThreshold",
  MIN_DEPOSIT: "minDeposit",
  MAX_WIN_AMOUNT: "maxWinAmount",
  ZERO_OUT_THRESHOLD: "zeroOutThreshold",
  MIN_BALANCE: "minBalance",
};
