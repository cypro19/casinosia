import db from "../../db/models";
import { getOne } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { LiveUpdateWalletService } from "../microservice";
import { ERRORS, ERROR_MSG, ERROR_CODE } from "../../utils/errors";
import {
  createEmailWithDynamicValues,
  getSendGridCredentials,
  sendDynamicMail,
} from "../helper/email";
import {
  ROLE,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
  BONUS_STATUS,
  EMAIL_TEMPLATE_TYPES,
  EMAIL_SUBJECTS,
  DEFAULT_LANGUAGE,
} from "../../utils/constant";

const constraints = {
  authCode: {
    presence: { allowEmpty: false },
  },
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

export class CancelService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const {
      userId,
      authCode,
      txAmount,
      txAmountCy,
      txId,
      txTypeId,
      txName,
      provider,
      siteName,
    } = this.filteredArgs;
    let updateStatus;
    let updateWithdrawRequest;
    let response = {
      user_id: userId.toString(),
    };

    const success = {
      user_id: userId.toString(),
      success: true,
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
        updateStatus = await transactionsDetails
          .set({ status: TRANSACTION_STATUS.CANCELLED })
          .save({ transaction });
      }

      if (transactionsDetails.transactionType === TRANSACTION_TYPE.DEPOSIT) {
        if (updateStatus) {
          const userBonus = await getOne({
            model: db.UserBonus,
            data: { userId, status: BONUS_STATUS.IN_PROCESS },
            include: {
              model: db.Bonus,
              as: "bonus",
              attributes: ["bonusId", "promotionTitle"],
            },
          });

          if (userBonus) {
            await userBonus
              .set({ status: BONUS_STATUS.CLAIMING })
              .save({ transaction });
          }

          response = success;
          const credentials = await getSendGridCredentials();

          if (Object.keys(credentials).length === 2) {
            const dynamicEmail = await createEmailWithDynamicValues({
              language: userDetails.locale || DEFAULT_LANGUAGE,
              emailType:
                EMAIL_TEMPLATE_TYPES.VALUE_T0_INT[
                  EMAIL_TEMPLATE_TYPES.DEPOSIT_FAILED
                ],
              userId: userDetails.userId,
              serviceData: {
                subject: EMAIL_SUBJECTS.deposit_failed,
                transactionId: txId,
                depositAmount:
                  Math.round(transactionsDetails.amount * 100) / 100,
              },
            });

            await sendDynamicMail({
              user: userDetails,
              credentials,
              subject: EMAIL_SUBJECTS.deposit_failed,
              successMsg: SUCCESS_MSG.EMAIL_SENT,
              senderName: siteName,
              dynamicEmail,
            });
          }
        } else {
          await transaction.rollback();
          return { ...failure };
        }
      } else {
        if (updateStatus) {
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
                status: TRANSACTION_STATUS.CANCELLED,
                actionableType: ROLE.MERCHANT,
                actionedAt: new Date(),
              })
              .save({ transaction });
          }

          if (updateWithdrawRequest) {
            await userDetails.userWallet
              .set({
                amount:
                  Math.round(
                    (userDetails.userWallet.amount + withdrawDetails.amount) *
                      100
                  ) / 100,
              })
              .save({ transaction });
            response = success;
          } else {
            await transaction.rollback();
            return { ...failure };
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
