import { getOne } from "./crud";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/responseMessage";
import db from "../../db/models";

const constraints = {
  userId: {
    presence: { allowEmpty: false },
  },
  walletId: {
    presence: { allowEmpty: false },
  },
  gameId: {
    presence: false,
  },
  actionType: {
    presence: { allowEmpty: false },
  },
  actionId: {
    presence: false,
  },
  amount: {
    presence: false,
  },
  gameIdentifier: {
    presence: false,
  },
  status: {
    presence: { allowEmpty: false },
  },
  currencyCode: {
    presence: false,
  },
  beforeBalance: {
    presence: false,
  },
  afterBalance: {
    presence: false,
  },
  transaction: {
    presence: { allowEmpty: false },
  },
  adminId: {
    presence: false,
  },
  nonCashAmount: {
    presence: false,
  },
  amountType: {
    presence: false,
  },
  primaryCurrencyAmount: {
    presence: false,
  },
  conversionRate: {
    presence: false,
  },
  options: {
    presence: false,
  },
  isSticky: {
    presence: false,
  },
  userBonusId: {
    presence: false,
  },
};

export class TransactionHandlerService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const {
      userId,
      walletId,
      actionType,
      actionId,
      amount,
      gameId,
      gameIdentifier,
      status,
      transaction,
      isSticky,
      userBonusId,
      beforeBalance,
      afterBalance,
      currencyCode,
      adminId,
      primaryCurrencyAmount,
      options,
      nonCashAmount,
      amountType,
      conversionRate,
    } = this.filteredArgs;

    try {
      const checkTransactionExists = await getOne({
        model: db.CasinoTransaction,
        data: { actionId },
      });

      if (checkTransactionExists) {
        await checkTransactionExists.update(
          {
            amount,
            beforeBalance,
            afterBalance,
            primaryCurrencyAmount,
            conversionRate,
          },
          { transaction, options }
        );

        return {
          casinoTransaction: checkTransactionExists,
          success: true,
          alreadyExists: true,
        };
      }

      const newTransaction = await db.CasinoTransaction.create(
        {
          userId,
          walletId,
          adminId,
          gameId,
          actionType,
          actionId,
          amount,
          status,
          currencyCode,
          beforeBalance,
          afterBalance,
          gameIdentifier,
          nonCashAmount,
          amountType,
          conversionRate,
          primaryCurrencyAmount,
          isSticky,
          userBonusId,
        },
        { transaction, options }
      );

      return {
        casinoTransaction: newTransaction,
        success: true,
        alreadyExists: false,
      };
    } catch (error) {
      return {
        err_type: ERRORS.INTERNAL,
        err: ERROR_MSG.SERVER_ERROR,
        success: false,
      };
    }
  }
}
