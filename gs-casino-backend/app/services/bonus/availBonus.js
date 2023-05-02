import db from "../../db/models";
import { Op, Sequelize } from "sequelize";
import { getDay } from "../../utils/common";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { LiveUpdateWalletService } from "../microservice";
import { IssueFreeSpinService } from "../casino/issueFreeSpins";
import { createNewEntity, getOne, getAll } from "../helper/crud";
import { BONUS_STATUS, BONUS_TYPE, ROLE } from "../../utils/constant";

const constraints = {
  id: {
    presence: { allowEmpty: false },
  },
  bonusId: {
    presence: { allowEmpty: false },
  },
  amount: {
    presence: false,
  },
  user: {
    presence: false,
  },
};

export class AvailBonusService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { id, bonusId, user } = this.filteredArgs;

    let data = { issuerId: id, issuerRole: ROLE.USER };

    const status = BONUS_STATUS.CLAIMING;
    const userDetails = user;
    const today = getDay();
    const games = {};

    const query = {
      bonusId,
      isActive: true,
      visibleInPromotions: true,
      validOnDays: { [Op.contains]: [today] },
      [Op.and]: [
        Sequelize.where(
          Sequelize.fn("date", Sequelize.col("valid_from")),
          "<=",
          new Date(Date.now())
        ),
        Sequelize.where(
          Sequelize.fn("date", Sequelize.col("valid_to")),
          ">=",
          new Date(Date.now())
        ),
      ],
    };

    try {
      const bonusExists = await getOne({
        model: db.Bonus,
        data: query,
        include: {
          model: db.UserBonus,
          as: "userBonus",
          where: { userId: id, issuerRole: ROLE.USER },
          required: false,
        },
      });

      if (!bonusExists) {
        return this.addError(ERRORS.METHOD_NOT_ALLOWED, ERROR_MSG.BONUS_CLAIM);
      } else if (bonusExists && bonusExists.userBonus) {
        return this.addError(
          ERRORS.METHOD_NOT_ALLOWED,
          "User Bonus " + ERROR_MSG.EXISTS
        );
      }

      const activeBonus = await getOne({
        model: db.UserBonus,
        data: {
          userId: id,
          status: {
            [Op.in]: [
              BONUS_STATUS.ACTIVE,
              BONUS_STATUS.CLAIMING,
              BONUS_STATUS.IN_PROCESS,
            ],
          },
        },
        attributes: ["userBonusId", "status"],
      });

      if (activeBonus)
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.ACTIVE_BONUS);

      const expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + bonusExists.daysToClear);

      data = {
        ...data,
        bonusId: bonusExists.bonusId,
        userId: id,
        bonusType: bonusExists.bonusType,
        status,
        expireAt: expireDate,
      };

      if (bonusExists.bonusType === BONUS_TYPE.FREESPINS) {
        const gameList = await getAll({
          model: db.MasterCasinoGame,
          data: { masterCasinoGameId: { [Op.in]: bonusExists.gameIds } },
          attributes: ["masterCasinoGameId", "identifier"],
        });

        gameList.forEach((game) => {
          games[game.dataValues.identifier] =
            game.dataValues.masterCasinoGameId;
        });
        data = {
          ...data,
          freeSpinsQty: bonusExists.quantity,
          games,
          betLevel: parseInt(bonusExists.other?.betLevel),
        };

        if (!activeBonus) data = { ...data, status: BONUS_STATUS.ACTIVE };
      }

      const transaction = await db.sequelize.transaction();

      const createBonus = await createNewEntity({
        model: db.UserBonus,
        data,
        transaction,
      });

      if (bonusExists.bonusType === BONUS_TYPE.FREESPINS) {
        const gameIdentifiers = Object.keys(games);

        let request = {
          user: userDetails,
          games: gameIdentifiers,
          freeSpinsQuantity: bonusExists.quantity,
          validUntilDays: expireDate,
        };

        if (createBonus.betLevel)
          request = { ...request, betLevel: createBonus.betLevel };

        const spinsIssue = await IssueFreeSpinService.execute(request);

        if (!spinsIssue.result.success) {
          await transaction.rollback();
          return this.addError(ERRORS.BAD_DATA, ERROR_MSG.BONUS_AVAIL);
        }
      }

      await bonusExists
        .set({ claimedCount: bonusExists.claimedCount + 1 })
        .save({ transaction });
      await transaction.commit();

      await LiveUpdateWalletService.execute({
        userUuid: userDetails.uniqueId,
        cash: userDetails.userWallet.amount,
        nonCash: userDetails.userWallet.nonCashAmount,
        userId: id,
        origin: "user-end",
      });

      return { createBonus, message: SUCCESS_MSG.AVAIL_BONUS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
