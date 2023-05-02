import { getOne } from "../common/crud";
import db from "../../db/models";
import ServiceBase from "../../common/serviceBase";
import { getElasticOptions } from "../common/elastic";
import { liveUpdateWallet } from "../common/realTime";
import { getOtherCurrenciesAmount } from "../../utils/common";
import { ERRORS, ERROR_CODES, ERROR_MSG } from "../../utils/responseMessage";
import { TransactionHandlerService } from "../common/transactionHandler";
import {
  ROLE,
  ACTION,
  TRANSACTION_STATUS,
  AMOUNT_TYPE,
} from "../../utils/constant";

const constraints = {
  user_id: {
    presence: { allowEmpty: false },
  },
  currency: {
    presence: { allowEmpty: false },
  },
  game: {
    presence: { allowEmpty: false },
  },
  game_id: {
    presence: { allowEmpty: false },
  },
  finished: {
    presence: false,
  },
  actions: {
    presence: { allowEmpty: false },
  },
};

export class RollbackService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const {
      user_id: userId,
      currency,
      game,
      game_id: gameId,
      actions,
    } = this.args;
    const transaction = this.context;
    const transactions = [];
    let casinoTransaction;

    try {
      const userExist = await getOne({
        model: db.User,
        data: { uniqueId: userId },
        transaction,
      });
      if (!userExist) return { code: 101, message: ERROR_MSG.INVALID_PLAYER };

      const userWallet = await getOne({
        model: db.Wallet,
        data: { ownerId: userExist.userId, ownerType: ROLE.USER },
        transaction,
      });

      if (!userWallet || userWallet.currencyCode !== currency)
        return { code: 101, message: ERROR_MSG.INVALID_PLAYER };

      for (const action of actions) {
        if (action.action === ACTION.ROLLBACK) {
          const checkTransactionExists = await getOne({
            model: db.CasinoTransaction,
            data: { actionId: action.original_action_id },
            transaction,
          });

          const transactionDetails = {
            userId: userExist.userId,
            walletId: userWallet.walletId,
            gameId: gameId,
            gameIdentifier: game,
            currencyCode: userWallet.currencyCode,
            beforeBalance: userWallet.amount,
          };

          if (checkTransactionExists) {
            const primaryCurrencyAmount = await getOtherCurrenciesAmount({
              primary: true,
              amount: checkTransactionExists.amount,
              currencyCode: userWallet.currencyCode,
            });

            const elasticOptions = await getElasticOptions({
              game,
              userExist,
              userWallet,
              conversionRate: primaryCurrencyAmount.conversionRate,
              amount: checkTransactionExists?.amount,
            });

            if (checkTransactionExists.actionType === ACTION.BET) {
              transactionDetails.afterBalance =
                userWallet.amount + checkTransactionExists.amount;
            }
            if (checkTransactionExists.actionType === ACTION.WIN) {
              transactionDetails.afterBalance =
                userWallet.amount - checkTransactionExists.amount;
            }
            transactionDetails.afterBalance =
              Math.round(transactionDetails.afterBalance * 100) / 100;

            casinoTransaction = await TransactionHandlerService.execute({
              primaryCurrencyAmount: primaryCurrencyAmount.amount,
              nonCashAmount: checkTransactionExists.nonCashAmount,
              adminId: checkTransactionExists.adminId,
              conversionRate: checkTransactionExists.conversionRate,
              options: elasticOptions,
              actionType: action.action,
              amountType: AMOUNT_TYPE.CASH,
              actionId: action.action_id,
              amount: checkTransactionExists.amount,
              status: TRANSACTION_STATUS.COMPLETED,
              ...transactionDetails,
              transaction,
            });

            if (!casinoTransaction.result.success)
              return {
                code: ERROR_CODES.BAD_REQUEST,
                message: ERROR_MSG.BAD_REQUEST,
              };
            if (
              casinoTransaction &&
              casinoTransaction?.result?.success &&
              !casinoTransaction.result.alreadyExists
            ) {
              let newBalance =
                casinoTransaction.result.casinoTransaction.afterBalance;

              if (newBalance < 0) newBalance = 0;
              await userWallet
                .set({ amount: newBalance })
                .save({ transaction });
              elasticOptions.statusValue = "rollback";
              await checkTransactionExists.update(
                { status: TRANSACTION_STATUS.ROLLBACK },
                { transaction, options: elasticOptions }
              );
            }
          } else {
            transactionDetails.afterBalance = transactionDetails.beforeBalance;
            const elasticOptions = await getElasticOptions({
              userExist,
              userWallet,
              conversionRate: 0,
              game,
              amount: 0,
            });

            casinoTransaction = await TransactionHandlerService.execute({
              primaryCurrencyAmount: 0,
              actionType: ACTION.ROLLBACK_BEFORE_BET_WIN,
              nonCashAmount: 0,
              conversionRate: 0,
              actionId: action.original_action_id,
              adminId: userExist.parentId,
              amount: 0,
              amountType: AMOUNT_TYPE.CASH,
              status: TRANSACTION_STATUS.COMPLETED,
              ...transactionDetails,
              transaction,
              options: elasticOptions,
            });

            if (!casinoTransaction.result.success) {
              return {
                code: ERROR_CODES.BAD_REQUEST,
                message: ERROR_MSG.BAD_REQUEST,
              };
            }

            elasticOptions.statusValue = "rollback";
            casinoTransaction = await TransactionHandlerService.execute({
              primaryCurrencyAmount: 0,
              actionType: action.action,
              actionId: action.action_id,
              amount: 0,
              adminId: userExist.parentId,
              nonCashAmount: 0,
              conversionRate: 0,
              amountType: AMOUNT_TYPE.CASH,
              status: TRANSACTION_STATUS.ROLLBACK,
              ...transactionDetails,
              transaction,
              options: elasticOptions,
            });

            if (!casinoTransaction.result.success) {
              return {
                code: ERROR_CODES.BAD_REQUEST,
                message: ERROR_MSG.BAD_REQUEST,
              };
            }
          }

          const entries = {
            action_id: casinoTransaction?.result.casinoTransaction?.actionId,
            tx_id: `${casinoTransaction?.result.casinoTransaction?.casinoTransactionId}`,
            processed_at:
              casinoTransaction?.result.casinoTransaction?.createdAt,
          };
          transactions.push(entries);
        }
      }

      const getUserBalance = await getOne({
        model: db.Wallet,
        data: { ownerId: userExist.userId, ownerType: ROLE.USER },
        attributes: ["amount", "totalAmount", "nonCashAmount"],
      });

      await liveUpdateWallet({
        userId: userExist.userId,
        userUuid: userExist.uniqueId,
        cash: getUserBalance.amount,
        nonCash: getUserBalance.nonCashAmount,
      });

      const response = {
        balance: Math.round(userWallet.amount * 100),
        game_id: gameId,
        transactions,
      };

      return { ...response };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
