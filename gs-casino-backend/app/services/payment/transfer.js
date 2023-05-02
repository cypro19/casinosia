import db from "../../db/models";
import { getOne } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { getElasticOptions } from "../helper/elastic";
import { TransactionHandlerService } from "../wallet";
import { LiveUpdateWalletService } from "../microservice";
import { ERRORS, ERROR_CODE, ERROR_MSG } from "../../utils/errors";
import {
  createEmailWithDynamicValues,
  getSendGridCredentials,
  sendDynamicMail,
} from "../helper/email";
import {
  AMOUNT_TYPE,
  BONUS_STATUS,
  DEFAULT_LANGUAGE,
  EMAIL_SUBJECTS,
  EMAIL_TEMPLATE_TYPES,
  ID,
  KEYS,
  ROLE,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
  WAGER_STATUS,
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
  txRefId: {
    presence: { allowEmpty: false },
  },
  txPspAmount: {
    presence: { allowEmpty: false },
  },
  txPspAmountCy: {
    presence: { allowEmpty: false },
  },
  fee: {
    presence: { allowEmpty: false },
  },
  feeCy: {
    presence: { allowEmpty: false },
  },
  siteName: {
    presence: { allowEmpty: false },
  },
};

export class TransferService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let {
      userId,
      txAmount,
      txAmountCy,
      txId,
      txName,
      siteName,
      ...moreDetails
    } = this.filteredArgs;
    let response, updateStatus, updateWithdrawRequest;

    const success = {
      user_id: userId.toString(),
      success: true,
      txId,
      merchantTxId: ID,
    };

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

      const transactionsDetails = await getOne({
        model: db.TransactionBanking,
        data: {
          actioneeId: userId,
          actioneeType: ROLE.USER,
          paymentTransactionId: txId,
        },
      });

      if (
        transactionsDetails &&
        transactionsDetails.status === TRANSACTION_STATUS.PENDING
      ) {
        updateStatus = await transactionsDetails.update(
          {
            status: TRANSACTION_STATUS.SUCCESS,
            isSuccess: true,
            moreDetails: {
              ...transactionsDetails.moreDetails,
              ...moreDetails,
            },
          },
          { transaction, options: { statusValue: "success" } }
        );
      }

      if (updateStatus) {
        if (
          transactionsDetails.transactionType === TRANSACTION_TYPE.DEPOSIT ||
          transactionsDetails.transactionType ===
            TRANSACTION_TYPE.INTERNAL.deposit
        ) {
          const newAmount =
            Math.round(
              (userDetails.userWallet.amount + transactionsDetails.amount) * 100
            ) / 100;
          await userDetails.userWallet
            .set({ amount: newAmount })
            .save({ transaction });

          const userBonus = await getOne({
            model: db.UserBonus,
            data: { userId, status: BONUS_STATUS.IN_PROCESS },
            include: {
              model: db.Bonus,
              as: "bonus",
              attributes: [
                "bonusId",
                "currency",
                "depositBonusPercent",
                "wageringRequirementType",
                "wageringMultiplier",
                "promotionTitle",
                "appliedBonusId",
                "quantity",
                "timePeriod",
              ],
            },
          });

          let bonusAmount = userDetails.userWallet.nonCashAmount;
          txAmount = parseFloat(txAmount);

          if (userBonus && userBonus.bonusAmount === 0) {
            if (
              txAmount >= userBonus.bonus.currency[txAmountCy][KEYS.MIN_DEPOSIT]
            ) {
              bonusAmount =
                (txAmount * userBonus.bonus.depositBonusPercent) / 100;
              bonusAmount = Math.round(bonusAmount * 100) / 100;
              if (
                bonusAmount >
                userBonus.bonus.currency[txAmountCy][KEYS.MAX_BONUS_THRESHOLD]
              ) {
                bonusAmount = parseFloat(
                  userBonus.bonus.currency[txAmountCy][KEYS.MAX_BONUS_THRESHOLD]
                );
              }

              userDetails.dataValues.wallet = userDetails.userWallet;
              const elasticOptions = await getElasticOptions({
                userDetails,
                userWallet: userDetails.userWallet,
                nonCashAmount: bonusAmount,
              });

              const transactionHandler =
                await TransactionHandlerService.execute({
                  sourceUser: userDetails.dataValues,
                  addAmount: bonusAmount,
                  amountType: AMOUNT_TYPE.NON_CASH,
                  transactionType: TRANSACTION_TYPE.BONUS,
                  status: TRANSACTION_STATUS.SUCCESS,
                  isSuccess: true,
                  options: elasticOptions,
                  transaction,
                });

              if (transactionHandler && transactionHandler.result.success) {
                await userDetails.userWallet
                  .set({
                    nonCashAmount:
                      userDetails.userWallet.nonCashAmount + bonusAmount,
                  })
                  .save({ transaction });

                const amountToWager =
                  Math.round(
                    (txAmount + bonusAmount) *
                      userBonus.bonus.wageringMultiplier *
                      100
                  ) / 100;

                await userBonus
                  .set({
                    cashAmount: Math.round(txAmount * 100) / 100,
                    bonusAmount,
                    amountToWager,
                    transactionId:
                      transactionHandler.result.transactionBanking
                        .transactionBankingId,
                    primaryCurrencyAmount:
                      transactionHandler.result.transactionBanking
                        .primaryCurrencyAmount,
                    wageringStatus: WAGER_STATUS.STARTED,
                    status: BONUS_STATUS.ACTIVE,
                  })
                  .save({ transaction });

                userBonus.dataValues.transaction =
                  transactionHandler.result.transactionBanking;
              }
            }
          }

          response = success;

          const credentials = await getSendGridCredentials();

          if (Object.keys(credentials).length === 2) {
            const dynamicEmail = await createEmailWithDynamicValues({
              language: userDetails.locale || DEFAULT_LANGUAGE,
              emailType:
                EMAIL_TEMPLATE_TYPES.VALUE_T0_INT[
                  EMAIL_TEMPLATE_TYPES.DEPOSIT_SUCCESS
                ],
              userId: userDetails.userId,
              serviceData: {
                subject: EMAIL_SUBJECTS.deposit_success,
                transactionId: txId,
                depositAmount:
                  Math.round(transactionsDetails.amount * 100) / 100,
              },
            });

            await sendDynamicMail({
              user: userDetails,
              credentials,
              subject: EMAIL_SUBJECTS.deposit_success,
              successMsg: SUCCESS_MSG.EMAIL_SENT,
              senderName: siteName,
              dynamicEmail,
            });
          }
        } else {
          const withdrawDetails = await getOne({
            model: db.WithdrawRequest,
            data: { userId, transactionId: txId },
            attributes: ["withdrawRequestId", "status", "amount"],
          });

          if (
            withdrawDetails &&
            withdrawDetails.status === TRANSACTION_STATUS.PENDING
          ) {
            updateWithdrawRequest = await withdrawDetails
              .set({
                status: TRANSACTION_STATUS.APPROVED,
              })
              .save({ transaction });
          }

          const credentials = await getSendGridCredentials();

          if (Object.keys(credentials).length === 2) {
            const dynamicEmail = await createEmailWithDynamicValues({
              language: userDetails.locale || DEFAULT_LANGUAGE,
              emailType:
                EMAIL_TEMPLATE_TYPES.VALUE_T0_INT[
                  EMAIL_TEMPLATE_TYPES.WITHDRAW_APPROVED
                ],
              userId: userDetails.userId,
              serviceData: {
                subject: EMAIL_SUBJECTS.withdraw_request_approved,
                withdrawAmount: Math.round(withdrawDetails.amount * 100) / 100,
              },
            });

            await sendDynamicMail({
              user: userDetails,
              credentials,
              subject: EMAIL_SUBJECTS.withdraw_request_approved,
              successMsg: SUCCESS_MSG.EMAIL_SENT,
              senderName: siteName,
              dynamicEmail,
            });
          }

          if (updateWithdrawRequest) {
            response = success;

            if (Object.keys(credentials).length === 2) {
              const dynamicEmail = await createEmailWithDynamicValues({
                language: userDetails.locale || DEFAULT_LANGUAGE,
                emailType:
                  EMAIL_TEMPLATE_TYPES.VALUE_T0_INT[
                    EMAIL_TEMPLATE_TYPES.WITHDRAW_PROCESSED
                  ],
                userId: userDetails.userId,
                serviceData: {
                  subject: EMAIL_SUBJECTS.withdraw_request_processed,
                  transactionId: txId,
                  depositAmount: Math.round(withdrawDetails.amount * 100) / 100,
                },
              });

              await sendDynamicMail({
                user: userDetails,
                credentials,
                subject: EMAIL_SUBJECTS.withdraw_request_processed,
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
      } else {
        await transaction.rollback();
        return { ...failure };
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
