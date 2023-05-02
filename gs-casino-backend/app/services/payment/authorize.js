import db from "../../db/models";
import { getOne } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { checkDepositLimit } from "../helper/casino";
import { getElasticOptions } from "../helper/elastic";
import { LiveUpdateWalletService } from "../microservice";
import { ERRORS, ERROR_CODE, ERROR_MSG } from "../../utils/errors";
import {
  TransactionHandlerService,
  CreateWithdrawRequestService,
} from "../wallet";
import {
  createEmailWithDynamicValues,
  getSendGridCredentials,
  sendDynamicMail,
} from "../helper/email";
import {
  DEFAULT_LANGUAGE,
  EMAIL_SUBJECTS,
  EMAIL_TEMPLATE_TYPES,
  ID,
  ROLE,
  TRANSACTION_TYPE,
} from "../../utils/constant";

const constraints = {
  userId: {
    presence: { allowEmpty: false },
  },
  txAmount: {
    presence: { allowEmpty: false },
  },
  txAmountCy: {
    presence: { allowEmpty: false },
  },
  txId: {
    presence: { allowEmpty: false },
  },
  txTypeId: {
    presence: { allowEmpty: false },
  },
  txName: {
    presence: { allowEmpty: false },
  },
  provider: {
    presence: { allowEmpty: false },
  },
  siteName: {
    presence: { allowEmpty: false },
  },
};

export class AuthorizeService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { userId, txAmount, txAmountCy, txId, txName, provider, siteName } =
      this.filteredArgs;

    let response;
    let conversionRate = 0;
    let transactionHandler;
    let newAmount = parseFloat(txAmount).toFixed(2);

    const txType =
      newAmount > 0 ? TRANSACTION_TYPE.DEPOSIT : TRANSACTION_TYPE.WITHDRAW;
    const failure = {
      user_id: userId.toString(),
      success: false,
      errCode: ERROR_CODE.TRANSACTION_FAILED,
      errMsg: ERROR_MSG.TRANSACTION_FAILED,
    };

    const transaction = await db.sequelize.transaction();

    try {
      const userDetails = await getOne({
        model: db.User,
        data: { userId },
        include: [{ model: db.Wallet, as: "userWallet" }],
      });

      userDetails.dataValues.wallet = userDetails.userWallet;

      const success = {
        user_id: userId.toString(),
        success: true,
        merchantTxId: ID,
        authCode: userDetails.uniqueId,
      };

      if (txAmountCy !== userDetails.userWallet.currencyCode) {
        const sourceExchangeRate = await getOne({
          model: db.Currency,
          data: { code: txAmountCy },
          attributes: ["exchangeRate"],
        });

        const targetExchangeRate = await getOne({
          model: db.Currency,
          data: { code: userDetails.userWallet.currencyCode },
          attributes: ["exchangeRate"],
        });

        conversionRate =
          sourceExchangeRate.exchangeRate / targetExchangeRate.exchangeRate;
        newAmount = Math.abs(
          (parseFloat(txAmount) * conversionRate).toFixed(2)
        );
      }

      const elasticOptions = await getElasticOptions({
        userDetails,
        userWallet: userDetails.userWallet,
        conversionRate,
        amount: newAmount,
      });

      if (txType === TRANSACTION_TYPE.DEPOSIT) {
        const checkLimit = await checkDepositLimit({
          userId,
          depositAmount: newAmount,
        });
        if (checkLimit.limitReached) {
          await LiveUpdateWalletService.execute({
            userUuid: userDetails.uniqueId,
            cash: userDetails.userWallet.amount,
            nonCash: userDetails.userWallet.nonCashAmount,
            userId,
            origin: "user-end",
            depositError: true,
            errorMsg: checkLimit.message,
          });
          return { ...failure };
        }

        if (
          (await db.TransactionBanking.count({
            where: {
              actioneeId: userDetails.userId,
              actioneeType: ROLE.USER,
              transactionType: TRANSACTION_TYPE.DEPOSIT,
            },
          })) === 0
        ) {
          elasticOptions.isFirstDeposit = true;
        }

        transactionHandler = await TransactionHandlerService.execute({
          sourceUser: userDetails.dataValues,
          addAmount: newAmount,
          conversionRate,
          transactionType: txType,
          paymentTransactionId: txId,
          paymentTransactionName: txName,
          paymentProvider: provider,
          options: elasticOptions,
          transaction,
        });

        if (transactionHandler.result.success) {
          response = success;
        } else {
          await transaction.rollback();
          return { ...failure };
        }
      } else {
        const withdrawRequest = await CreateWithdrawRequestService.execute({
          id: userId,
          name: userDetails.firstName + " " + userDetails.lastName,
          email: userDetails.email,
          withdrawAmount: -newAmount,
          transactionId: txId,
          paymentProvider: provider,
          options: elasticOptions,
          transaction,
        });

        if (withdrawRequest.result.success) {
          transactionHandler = await TransactionHandlerService.execute({
            sourceUser: userDetails.dataValues,
            addAmount: newAmount,
            conversionRate,
            transactionType: txType,
            paymentTransactionId: txId,
            paymentTransactionName: txName,
            paymentProvider: provider,
            options: elasticOptions,
            transaction,
          });
        }

        if (
          transactionHandler &&
          transactionHandler.result.success &&
          withdrawRequest.result.success
        ) {
          await userDetails.userWallet
            .set({
              amount:
                Math.round(
                  (userDetails.userWallet.amount - Math.abs(newAmount)) * 100
                ) / 100,
            })
            .save({ transaction });

          response = success;

          const credentials = await getSendGridCredentials();

          if (Object.keys(credentials).length === 2) {
            const dynamicEmail = await createEmailWithDynamicValues({
              language: userDetails.locale || DEFAULT_LANGUAGE,
              emailType:
                EMAIL_TEMPLATE_TYPES.VALUE_T0_INT[
                  EMAIL_TEMPLATE_TYPES.WITHDRAW_REQUEST_RECEIVED
                ],
              userId: userDetails.userId,
              serviceData: {
                subject: EMAIL_SUBJECTS.withdraw_request_received,
                transactionId: txId,
                withdrawAmount: Math.round(Math.abs(newAmount) * 100) / 100,
              },
            });

            await sendDynamicMail({
              user: userDetails,
              credentials,
              subject: EMAIL_SUBJECTS.withdraw_request_received,
              successMsg: SUCCESS_MSG.EMAIL_SENT,
              senderName: siteName,
              dynamicEmail,
            });
          }
        } else {
          await transaction.rollback();
          return { ...failure };
        }
      }

      await transaction.commit();

      await LiveUpdateWalletService.execute({
        userUuid: userDetails.uniqueId,
        cash: userDetails.userWallet.amount,
        nonCash: userDetails.userWallet.nonCashAmount,
        userId,
        origin: "user-end",
      });

      return { ...response };
    } catch (error) {
      await transaction.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
