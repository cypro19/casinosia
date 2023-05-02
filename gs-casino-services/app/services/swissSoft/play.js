import Logger from "../../common/logger";
import ServiceBase from "../../common/serviceBase";
import db from "../../db/models";
import {
  checkActiveBonus,
  getGameAggregatorAndProvider,
  getLastBet,
  getOtherCurrenciesAmount,
  getPrimaryCurrencyAmount,
} from "../../utils/common";
import {
  ACTION,
  AMOUNT_TYPE,
  BONUS_STATUS,
  BONUS_TYPE,
  KEYS,
  ROLE,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
  WAGER_STATUS,
} from "../../utils/constant";
import { ERRORS, ERROR_CODES, ERROR_MSG } from "../../utils/responseMessage";
import { checkLimits } from "../common/casino";
import { getOne } from "../common/crud";
import { getElasticOptions } from "../common/elastic";
import { liveUpdateWallet } from "../common/realTime";
import { TransactionHandlerService } from "../common/transactionHandler";

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
    presence: false,
  },
  finished: {
    presence: false,
  },
  actions: {
    presence: false,
  },
};

export class PlayService extends ServiceBase {
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
    } = this.filteredArgs;
    let getUserBalance,
      currCashBalance,
      wagerAmount,
      lastBetAmountType,
      roundActionAmount;
    let socketWageringAmount = null;
    let socketAmountToWager = null;
    let socketWagerStatus = null;
    let socketWagering = false;
    const wageringPercent = 100;
    const transactions = [];
    let response = {};

    const transaction = this.context;

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
      if (!userWallet || userWallet.currencyCode !== currency) {
        return { code: 101, message: ERROR_MSG.INVALID_PLAYER };
      }

      const currentGame = await getGameAggregatorAndProvider({
        game,
        transaction,
      });
      let userBonus = await checkActiveBonus({
        userId: userExist.userId,
        gameId: game,
        game: currentGame,
        transaction,
      });

      if (!actions) {
        if (userBonus)
          response = {
            balance: Math.round(
              (userBonus.cashAmount + userWallet.nonCashAmount) * 100
            ),
          };
        else response = { balance: Math.round(userWallet.amount * 100) };

        return { code: 200, ...response };
      }

      if (actions) {
        Logger.info(actions, "actions");

        for (const action of actions) {
          if (userBonus) {
            socketWagerStatus = userBonus.status;
            socketAmountToWager = userBonus.amountToWager;
            currCashBalance = userBonus.cashAmount;
          } else currCashBalance = userWallet.amount;

          roundActionAmount = parseFloat((action.amount / 100).toFixed(2));
          userBonus = await checkActiveBonus({
            userId: userExist.userId,
            gameId: game,
            game: currentGame.masterCasinoGameId,
            transaction,
          });

          if (action.action === ACTION.BET) {
            // Responsible gaming limit check
            const checkLimitResponse = await checkLimits({
              userExist,
              walletId: userWallet.walletId,
              betAmount: roundActionAmount,
              transaction,
            });

            await liveUpdateWallet({
              userId: userExist.userId,
              userUuid: userId,
              cash: userWallet.amount,
              nonCash: userWallet.nonCashAmount,
              limitTable: checkLimitResponse.limitTable,
              level: userExist.level,
              loyaltyPoints: userExist.loyaltyPoints,
            });

            if (checkLimitResponse.limitReached) {
              let balance;
              if (userBonus)
                balance = Math.round(
                  (userBonus.cashAmount + userWallet.nonCashAmount) * 100
                );
              else balance = Math.round(userWallet.amount * 100);

              return {
                code: 105,
                message: checkLimitResponse.message,
                balance,
              };
            }

            if (
              userBonus &&
              userBonus.bonus?.currency[userWallet.currencyCode] !==
                undefined &&
              userWallet.nonCashAmount <=
                userBonus.bonus?.currency[userWallet.currencyCode][
                  KEYS.ZERO_OUT_THRESHOLD
                ]
            ) {
              const transactionDetails = {
                actioneeType: ROLE.USER,
                actioneeId: userExist.userId,
                actioneeEmail: userExist.email,
                actioneeName: userExist.firstName + " " + userExist.lastName,
                targetId: userExist.userId,
                walletId: userWallet.walletId,
                amount: userWallet.nonCashAmount,
                currencyCode: userWallet.currencyCode,
                primaryCurrencyAmount: 0,
                beforeBalance: userWallet.nonCashAmount,
                adminId: userExist.parentId,
                countryCode: userExist.countryCode,
                transactionType: TRANSACTION_TYPE.ZEROED_OUT,
                transactionDateTime: new Date().toISOString(),
                isSuccess: true,
                amountType: AMOUNT_TYPE.CASH,
                status: TRANSACTION_STATUS.COMPLETED,
              };

              const options = await getElasticOptions({
                userExist,
                userWallet,
                game,
                amount: 0,
                transaction,
              });
              const transactionBanking = await db.TransactionBanking.create(
                { ...transactionDetails },
                { transaction, options }
              );

              if (!transactionBanking)
                return { message: ERROR_MSG.SERVER_ERROR };

              await userBonus
                .set({
                  wageringStatus: WAGER_STATUS.CANCELLED,
                  status: BONUS_STATUS.ZEROED_OUT,
                  amountConverted: 0,
                })
                .save({ transaction });
              await userWallet.set({ nonCashAmount: 0 }).save({ transaction });

              await liveUpdateWallet({
                userId: userExist.userId,
                userUuid: userId,
                cash: userWallet.amount,
                nonCash: 0,
                wageringStatus: BONUS_STATUS.ZEROED_OUT,
              });
              return {
                code: 100,
                message: "Not enough funds.",
                balance: Math.round(userWallet.totalAmount * 100),
              };
            }

            if (
              userBonus &&
              (userBonus.cashAmount + userWallet.nonCashAmount) * 100 <
                action.amount
            ) {
              await liveUpdateWallet({
                userId: userExist.userId,
                userUuid: userId,
                cash: userWallet.amount,
                nonCash: userWallet.nonCashAmount,
              });
              return {
                code: 100,
                message: "Not enough funds.",
                balance: Math.round(
                  (userBonus.cashAmount + userWallet.nonCashAmount) * 100
                ),
              };
            } else if (!userBonus && userWallet.amount * 100 < action.amount) {
              return {
                code: 100,
                message: "Not enough funds.",
                balance: Math.round(userWallet.amount * 100),
              };
            }
          }

          const primaryCurrencyAmount = await getOtherCurrenciesAmount({
            amount: roundActionAmount,
            primary: true,
            currencyCode: userWallet.currencyCode,
            transaction,
          });

          const transactionDetails = {
            userId: userExist.userId,
            adminId: userExist.parentId,
            walletId: userWallet.walletId,
            currencyCode: userWallet.currencyCode,
            gameId,
            actionType: action.action,
            actionId: action.action_id,
            gameIdentifier: game,
            status: TRANSACTION_STATUS.COMPLETED,
            primaryCurrencyAmount: primaryCurrencyAmount.amount,
          };

          const elasticOptions = await getElasticOptions({
            userExist,
            userWallet,
            game,
            amount: roundActionAmount,
            transaction,
          });

          if (action.action === ACTION.BET) {
            if (userBonus) {
              transactionDetails.userBonusId = userBonus.userBonusId;

              if (userBonus.cashAmount * 100 >= action.amount) {
                transactionDetails.amountType = AMOUNT_TYPE.CASH;
                transactionDetails.amount = roundActionAmount;
                transactionDetails.beforeBalance = currCashBalance;
                transactionDetails.afterBalance =
                  transactionDetails.beforeBalance - roundActionAmount;
                currCashBalance =
                  Math.round(transactionDetails.afterBalance * 100) / 100;
                if (userBonus.bonus.isSticky)
                  transactionDetails.isSticky = true;
                Logger.info(
                  "BET request with bonus using only cash amount",
                  transactionDetails.amount,
                  transactionDetails.beforeBalance,
                  transactionDetails.afterBalance
                );
              } else if (
                userBonus.cashAmount > 0 &&
                (userBonus.cashAmount + userWallet.nonCashAmount) * 100 >=
                  action.amount
              ) {
                transactionDetails.amountType = AMOUNT_TYPE.CASH_NON_CASH;
                transactionDetails.amount = currCashBalance;
                transactionDetails.nonCashAmount =
                  Math.round(
                    (roundActionAmount - transactionDetails.amount) * 100
                  ) / 100;
                transactionDetails.beforeBalance =
                  Math.round(
                    (currCashBalance + userWallet.nonCashAmount) * 100
                  ) / 100;
                transactionDetails.afterBalance =
                  transactionDetails.beforeBalance - roundActionAmount;
                currCashBalance = 0;
                Logger.info(
                  "BET request with bonus using only cash-non-cash amount",
                  transactionDetails.amount,
                  transactionDetails.nonCashAmount,
                  transactionDetails.beforeBalance,
                  transactionDetails.afterBalance
                );
              } else if (userWallet.nonCashAmount * 100 >= action.amount) {
                transactionDetails.amountType = AMOUNT_TYPE.NON_CASH;
                transactionDetails.nonCashAmount = roundActionAmount;
                transactionDetails.beforeBalance = userWallet.nonCashAmount;
                transactionDetails.afterBalance =
                  transactionDetails.beforeBalance - roundActionAmount;
                Logger.info(
                  "BET request with bonus using only non-cash amount",
                  transactionDetails.nonCashAmount,
                  transactionDetails.beforeBalance,
                  transactionDetails.afterBalance
                );
              }
            } else {
              transactionDetails.amountType = AMOUNT_TYPE.CASH;
              transactionDetails.amount = roundActionAmount;
              transactionDetails.beforeBalance = currCashBalance;
              transactionDetails.afterBalance =
                userWallet.amount - roundActionAmount;
              currCashBalance =
                Math.round(transactionDetails.afterBalance * 100) / 100;
              Logger.info(
                "BET request without bonus using only cash amount",
                transactionDetails.amount,
                transactionDetails.beforeBalance,
                transactionDetails.afterBalance
              );
            }
          }

          if (action.action === ACTION.WIN) {
            const lastBet = await getLastBet({
              actionType: ACTION.BET,
              gameId: transactionDetails.gameId,
              transaction,
            });
            let fromLastBonus = false;
            Logger.info(
              "lastBetForWin ",
              lastBet,
              " and its bonus",
              lastBet?.userBonusId
            );

            if (lastBet && lastBet.userBonusId) {
              const bonusForLastBet = await getOne({
                model: db.UserBonus,
                data: { userBonusId: lastBet.userBonusId },
                include: { model: db.Bonus, as: "bonus" },
                transaction,
              });

              if (lastBet?.amountType !== AMOUNT_TYPE.CASH) {
                Logger.info("lastBet is either non-cash or sticky");

                if (userBonus?.userBonusId !== bonusForLastBet.userBonusId) {
                  Logger.info("lastBet bonus is not same as current bonus");
                  fromLastBonus = true;
                  transactionDetails.actionType = ACTION.PRE_WIN;

                  if (bonusForLastBet.status !== BONUS_STATUS.COMPLETED) {
                    Logger.info("lastBet bonus was incomplete");
                    roundActionAmount = 0;
                  } else {
                    if (
                      bonusForLastBet.bonus.currency[userWallet.currencyCode][
                        KEYS.MAX_WIN_AMOUNT
                      ] <= bonusForLastBet.amountConverted
                    ) {
                      Logger.info(
                        "lastBet bonus was complete but had reached MAX-WIN condition"
                      );
                      roundActionAmount = 0;
                    } else {
                      if (
                        roundActionAmount >=
                        bonusForLastBet.bonus.currency[userWallet.currencyCode][
                          KEYS.MAX_WIN_AMOUNT
                        ] -
                          bonusForLastBet.amountConverted
                      ) {
                        Logger.info(
                          "lastBet bonus was complete and amount needs to add in cash"
                        );
                        roundActionAmount =
                          Math.round(
                            (bonusForLastBet.bonus.currency[
                              userWallet.currencyCode
                            ][KEYS.MAX_WIN_AMOUNT] -
                              bonusForLastBet.amountConverted) *
                              100
                          ) / 100;
                      }
                    }
                  }
                }
              }
            }

            if (userBonus && !fromLastBonus) {
              transactionDetails.userBonusId = userBonus.userBonusId;

              if (!lastBetAmountType) {
                const lastBet = await getLastBet({
                  actionType: ACTION.BET,
                  gameId: transactionDetails.gameId,
                  transaction,
                });
                lastBetAmountType = lastBet?.amountType;
              }

              if (userBonus.bonus.isSticky) {
                transactionDetails.amountType = AMOUNT_TYPE.NON_CASH;
                transactionDetails.nonCashAmount = roundActionAmount;
                transactionDetails.beforeBalance = userWallet.nonCashAmount;
                transactionDetails.afterBalance =
                  userWallet.nonCashAmount + roundActionAmount;
                Logger.info(
                  "WIN request with sticky bonus(any amt) ",
                  transactionDetails.nonCashAmount,
                  transactionDetails.beforeBalance,
                  transactionDetails.afterBalance
                );
              }

              socketWagering = true;
              socketWagerStatus = userBonus.status;
              socketAmountToWager = userBonus.amountToWager;
              socketWageringAmount = userBonus.wageredAmount;
            } else {
              transactionDetails.amountType = AMOUNT_TYPE.CASH;
              transactionDetails.amount = roundActionAmount;
              transactionDetails.beforeBalance = currCashBalance;
              transactionDetails.afterBalance =
                transactionDetails.beforeBalance + roundActionAmount;
              currCashBalance =
                Math.round(transactionDetails.afterBalance * 100) / 100;
              Logger.info(
                "WIN request without bonus",
                transactionDetails.amount,
                transactionDetails.beforeBalance,
                transactionDetails.afterBalance
              );
            }
          }

          transactionDetails.afterBalance =
            Math.round(transactionDetails.afterBalance * 100) / 100;
          elasticOptions.totalAmount =
            transactionDetails.afterBalance + userWallet.nonCashAmount;

          const casinoTransaction = await TransactionHandlerService.execute({
            ...transactionDetails,
            conversionRate: primaryCurrencyAmount.conversionRate,
            options: elasticOptions,
            transaction,
          });

          if (!casinoTransaction.result.success)
            return {
              code: ERROR_CODES.BAD_REQUEST,
              message: ERROR_MSG.BAD_REQUEST,
            };
          else if (!casinoTransaction.result.alreadyExists) {
            const newAmount =
              casinoTransaction.result.casinoTransaction.afterBalance;

            if (userBonus) {
              if (action.action === ACTION.WIN)
                await userWallet
                  .set({ nonCashAmount: newAmount })
                  .save({ transaction });
              else {
                lastBetAmountType =
                  casinoTransaction.result.casinoTransaction?.amountType;

                if (
                  casinoTransaction.result.casinoTransaction?.amountType ===
                  AMOUNT_TYPE.CASH
                ) {
                  await userWallet
                    .set({
                      amount:
                        Math.round(
                          (userWallet.amount - roundActionAmount) * 100
                        ) / 100,
                    })
                    .save({ transaction });
                  await userBonus
                    .set({ cashAmount: currCashBalance })
                    .save({ transaction });
                } else {
                  if (
                    casinoTransaction.result.casinoTransaction?.amountType ===
                    AMOUNT_TYPE.CASH_NON_CASH
                  ) {
                    await userWallet
                      .set({
                        amount:
                          Math.round(
                            (userWallet.amount - transactionDetails.amount) *
                              100
                          ) / 100,
                        nonCashAmount: newAmount,
                      })
                      .save({ transaction });
                  } else
                    await userWallet
                      .set({ nonCashAmount: newAmount })
                      .save({ transaction });

                  await userBonus
                    .set({ cashAmount: currCashBalance })
                    .save({ transaction });
                }
              }

              if (
                action.action === ACTION.BET &&
                !(
                  userBonus.bonus.bonusBetOnly &&
                  casinoTransaction.result.casinoTransaction?.amountType ===
                    AMOUNT_TYPE.CASH
                )
              ) {
                if (
                  userBonus.bonus.bonusBetOnly &&
                  casinoTransaction.result.casinoTransaction.amountType ===
                    AMOUNT_TYPE.CASH_NON_CASH
                ) {
                  wagerAmount =
                    Math.round(
                      (userBonus.wageredAmount +
                        (casinoTransaction.result.casinoTransaction
                          .nonCashAmount *
                          wageringPercent) /
                          100) *
                        100
                    ) / 100;
                } else
                  wagerAmount =
                    Math.round(
                      (userBonus.wageredAmount +
                        (roundActionAmount * wageringPercent) / 100) *
                        100
                    ) / 100;

                await userBonus
                  .set({ wageredAmount: wagerAmount })
                  .save({ transaction });
                socketWagering = true;
                socketWageringAmount = wagerAmount;
                socketAmountToWager = userBonus.amountToWager;
                socketWagerStatus = userBonus.status;
              }
            } else
              await userWallet
                .set({ amount: currCashBalance })
                .save({ transaction });
          }

          let entries = {
            action_id: casinoTransaction.result.casinoTransaction.actionId,
            tx_id: `${casinoTransaction.result.casinoTransaction.casinoTransactionId}`,
            processed_at: casinoTransaction.result.casinoTransaction.createdAt,
          };

          if (action.action === "bet")
            entries = { ...entries, userBonus_amount: 0 };
          transactions.push(entries);
        }

        if (
          userBonus &&
          wagerAmount >= userBonus.amountToWager &&
          userBonus.wageringStatus !== WAGER_STATUS.COMPLETED
        ) {
          const { amount, conversionRate } = await getPrimaryCurrencyAmount({
            currencyCode: userWallet.currencyCode,
            amount: userWallet.nonCashAmount,
            transaction,
          });

          const options = await getElasticOptions({
            userExist,
            userWallet,
            game,
            amount: userWallet.nonCashAmount,
            transaction,
          });

          let amountToConvert;

          if (
            userBonus.bonus?.currency[userWallet.currencyCode] !== undefined &&
            userWallet.nonCashAmount >
              userBonus.bonus?.currency[userWallet.currencyCode][
                KEYS.MAX_WIN_AMOUNT
              ]
          ) {
            amountToConvert =
              userBonus.bonus.currency[userWallet.currencyCode][
                KEYS.MAX_WIN_AMOUNT
              ];
            socketWagerStatus = KEYS.MAX_WIN_AMOUNT;
          } else amountToConvert = userWallet.nonCashAmount;

          const transactionDetails = {
            actioneeType: ROLE.USER,
            actioneeId: userExist.userId,
            actioneeEmail: userExist.email,
            actioneeName: userExist.firstName + " " + userExist.lastName,
            targetId: userExist.userId,
            walletId: userWallet.walletId,
            amount: amountToConvert,
            currencyCode: userWallet.currencyCode,
            beforeBalance: userWallet.amount,
            primaryCurrencyAmount: amount,
            adminId: userExist.parentId,
            countryCode: userExist.countryCode,
            transactionType: TRANSACTION_TYPE.BONUS_TO_CASH,
            transactionDateTime: new Date().toISOString(),
            conversionRate,
            isSuccess: true,
            amountType: AMOUNT_TYPE.CASH,
            status: TRANSACTION_STATUS.COMPLETED,
          };

          const transactionBanking = await db.TransactionBanking.create(
            { ...transactionDetails },
            { transaction, options }
          );

          if (transactionBanking) {
            const newAmount =
              Math.round(
                (userWallet.amount + parseFloat(amountToConvert)) * 100
              ) / 100;
            await userWallet
              .set({ amount: newAmount, nonCashAmount: 0 })
              .save({ transaction });
            await userBonus
              .set({
                wageredAmount: wagerAmount,
                wageringStatus: WAGER_STATUS.COMPLETED,
                status: BONUS_STATUS.COMPLETED,
                amountConverted: parseFloat(amountToConvert),
              })
              .save({ transaction });

            socketWagering = true;
            socketWageringAmount = wagerAmount;
            socketAmountToWager = userBonus.amountToWager;
            if (socketWagerStatus !== KEYS.MAX_WIN_AMOUNT)
              socketWagerStatus = BONUS_STATUS.COMPLETED;
          }
        }

        getUserBalance = await getOne({
          model: db.Wallet,
          data: { ownerId: userExist.userId, ownerType: ROLE.USER },
          attributes: ["amount", "totalAmount", "nonCashAmount"],
        });

        await liveUpdateWallet({
          userId: userExist.userId,
          userUuid: userId,
          cash: getUserBalance.amount,
          nonCash: getUserBalance.nonCashAmount,
          wagering: socketWagering,
          wageredAmount: socketWageringAmount,
          amountToWager: socketAmountToWager,
          wageringStatus: socketWagerStatus,
        });
      }

      response = {
        balance: Math.round(userWallet.amount * 100),
        game_id: gameId,
        transactions,
      };

      const userBonusDetail = await getOne({
        model: db.UserBonus,
        attributes: ["cashAmount", "bonusType"],
        data: { userId: userExist.userId, status: BONUS_STATUS.ACTIVE },
        transaction,
      });

      if (userBonusDetail) {
        if (userBonusDetail.bonusType !== BONUS_TYPE.FREESPINS) {
          response = {
            ...response,
            balance: Math.round(
              (Math.round(
                (userBonusDetail.cashAmount + getUserBalance.nonCashAmount) *
                  100
              ) /
                100) *
                100
            ),
          };
        }
      }

      return { code: 200, ...response };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
