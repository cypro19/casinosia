import { Op } from "sequelize";
import db from "../../db/models";
import { getOne, getAll } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { BONUS_TYPE } from "../../utils/constant";

const constraints = {
  bonusId: {
    presence: false,
  },
  userBonusId: {
    presence: false,
  },
};

export class GetBonusDetailService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { bonusId, userBonusId } = this.filteredArgs;

    try {
      const query = { bonusId };
      const bonusDetails = await getOne({
        model: db.Bonus,
        data: query,
        include: [{ model: db.WageringTemplate }],
      });

      if (!bonusDetails)
        return this.addError(
          ERRORS.NOT_FOUND,
          "Bonus details " + ERROR_MSG.NOT_FOUND
        );

      if (bonusDetails.bonusType === BONUS_TYPE.BALANCE) {
        const appliedBonus = await getOne({
          model: db.Bonus,
          data: { bonusId: bonusDetails.appliedBonusId },
          attributes: ["bonusId", "promotionTitle"],
        });
        bonusDetails.dataValues.appliedBonusTitle = appliedBonus.promotionTitle;
      }

      if (bonusDetails.bonusType === BONUS_TYPE.FREESPINS) {
        let query = { masterCasinoGameId: { [Op.in]: bonusDetails.gameIds } };

        if (userBonusId) {
          const userBonus = await getOne({
            model: db.UserBonus,
            data: { userBonusId },
            attributes: [
              "userBonusId",
              "games",
              "freeSpinsQty",
              "betLevel",
              "expireAt",
            ],
          });

          if (userBonus.games)
            query = { identifier: { [Op.in]: Object.keys(userBonus.games) } };
          bonusDetails.dataValues.quantity = userBonus.freeSpinsQty;
          bonusDetails.dataValues.other.betLevel = userBonus.betLevel;
          bonusDetails.dataValues.validTo = userBonus.expireAt;
        }

        const gameList = await getAll({
          model: db.CategoryGame,
          include: [
            {
              model: db.MasterCasinoGame,
              where: query,
              attributes: [],
            },
          ],
          attributes: ["name"],
        });

        bonusDetails.dataValues.games = gameList;
      }

      return { bonusDetails, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
