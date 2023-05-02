import ServiceBase from "../../common/serviceBase";
import { WEB_SOCKET_CODE } from "../../utils/constant";

const constraints = {
  userUuid: {
    presence: { allowEmpty: false },
  },
  cash: {
    presence: { allowEmpty: false },
  },
  nonCash: {
    presence: { allowEmpty: false },
  },
  userId: {
    presence: { allowEmpty: false },
  },
  origin: {
    presence: false,
  },
  wagering: {
    presence: false,
  },
  wageredAmount: {
    presence: false,
  },
  level: {
    presence: false,
  },
  loyaltyPoints: {
    presence: false,
  },
  wageringStatus: {
    presence: false,
  },
  amountToWager: {
    presence: false,
  },
  depositError: {
    presence: false,
  },
  errorMsg: {
    presence: false,
  },
  limitTable: {
    presence: false,
  },
};

export class LiveUpdateWalletService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let {
      userUuid,
      cash,
      nonCash,
      userId,
      origin,
      wagering,
      wageredAmount,
      loyaltyPoints,
      level,
      amountToWager,
      wageringStatus,
      depositError,
      errorMsg,
      limitTable,
    } = this.filteredArgs;
    let loyaltyExist = false;

    if (!origin) origin = "casino-end";

    if (wagering !== true) {
      wagering = false;
      wageredAmount = null;
    }

    if (depositError !== true) {
      depositError = false;
      errorMsg = null;
    }

    if (loyaltyPoints && level) {
      loyaltyExist = true;
    }

    try {
      const data = {
        operation: WEB_SOCKET_CODE.UPDATEWALLET,
        cash,
        nonCash,
        total: (cash + nonCash).toFixed(2),
        userId,
        origin,
        wagering,
        wageredAmount,
        amountToWager,
        wageringStatus,
        loyaltyExist,
        loyaltyPoints,
        level,
        depositError,
        errorMsg,
        limitTable,
      };
      
      return { success: true, message: "wallet updated" };
    } catch {
      return { success: false, message: "Error" };
    }
  }
}
