import db from "../../db/models";
import { Op } from "sequelize";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { createNewEntity, getAll, getOne } from "../helper/crud";
import {
  BONUS_STATUS,
  BONUS_TYPE,
  DEFAULT_LANGUAGE,
} from "../../utils/constant";
import { IssueFreeSpinService } from "../casino/issueFreeSpins";

const constraints = {
  userId: {
    presence: { allowEmpty: false },
  },
  bonusId: {
    presence: { allowEmpty: false },
  },
  gameIds: {
    presence: false,
  },
  level: {
    presence: false,
  },
  spins: {
    presence: { allowEmpty: false },
  },
  adminDetails: {
    presence: { allowEmpty: false },
  },
};

export class IssueFreeSpinBonusService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { userId, bonusId, gameIds, level, spins, adminDetails } =
      this.filteredArgs;
    let status = BONUS_STATUS.PENDING;
    const gameIdentifiers = {};
    let games;

    const transaction = await db.sequelize.transaction();

    try {
      const userDetails = await getOne({
        model: db.User,
        data: { userId },
      });

      if (!userDetails) {
        return this.addError(
          ERRORS.BAD_DATA,
          "User Details " + ERROR_MSG.NOT_EXISTS
        );
      }

      const bonusExists = await getOne({
        model: db.Bonus,
        data: { bonusId, bonusType: BONUS_TYPE.FREESPINS },
      });

      if (!bonusExists) {
        return this.addError(
          ERRORS.BAD_DATA,
          "FreeSpins Bonus " + ERROR_MSG.NOT_EXISTS
        );
      }

      games = bonusExists.gameIds;

      const activeBonus = await getOne({
        model: db.UserBonus,
        data: {
          userId,
          status: { [Op.in]: [BONUS_STATUS.ACTIVE, BONUS_STATUS.IN_PROCESS] },
        },
        attributes: ["userBonusId", "status"],
      });

      if (!activeBonus) status = BONUS_STATUS.ACTIVE;

      const expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + bonusExists.daysToClear);

      if (gameIds && gameIds.length)
        games = [...new Set([...gameIds, ...bonusExists.gameIds])];

      const gameList = await getAll({
        model: db.MasterCasinoGame,
        data: { masterCasinoGameId: { [Op.in]: games } },
        attributes: ["masterCasinoGameId", "identifier"],
      });

      gameList.forEach((game) => {
        gameIdentifiers[game.dataValues.identifier] =
          game.dataValues.identifier;
      });

      let data = {
        bonusId: bonusExists.bonusId,
        userId,
        bonusType: bonusExists.bonusType,
        freeSpinsQty: spins,
        status,
        games: gameIdentifiers,
        issuerId: adminDetails.id,
        issuerRole: adminDetails.role,
        expireAt: expireDate,
      };

      if (level) {
        data = { ...data, betLevel: parseInt(level) };
      } else if (bonusExists.other?.betLevel)
        data = { ...data, betLevel: parseInt(bonusExists.other?.betLevel) };

      let createBonus = await createNewEntity({
        model: db.UserBonus,
        data,
        transaction,
      });

      await bonusExists
        .set({ claimedCount: bonusExists.claimedCount + 1 })
        .save({ transaction });

      userDetails.dataValues.issueId = createBonus.uniqueId;

      if (!activeBonus) {
        let request = {
          user: userDetails,
          games: Object.keys(gameIdentifiers),
          freeSpinsQuantity: spins,
          validUntilDays: expireDate,
        };

        if (userDetails.betLevel)
          request = { ...request, betLevel: userDetails.betLevel };

        const spinsIssue = await IssueFreeSpinService.execute(request);

        if (!spinsIssue.result.success) {
          await transaction.rollback();
          return this.addError(ERRORS.BAD_DATA, ERROR_MSG.BONUS_ISSUE);
        }
      }

      await transaction.commit();

      createBonus = {
        ...createBonus,
        bonus: { promotionTitle: bonusExists.promotionTitle[DEFAULT_LANGUAGE] },
      };

      return { createBonus, message: SUCCESS_MSG.AVAIL_BONUS };
    } catch (error) {
      await transaction.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
