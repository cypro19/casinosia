import { Op } from "sequelize";
import db from "../../db/models";
import { getDay } from "../../utils/common";
import { getOne, getAll } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { BONUS_TYPE, DEFAULT_LANGUAGE, ROLE } from "../../utils/constant";
import { mapFavoriteGame } from "../helper/casino";

const constraints = {
  bonusId: {
    presence: { allowEmpty: false },
  },
  userId: {
    presence: false,
  },
  userBonusId: {
    presence: false,
  },
  language: {
    presence: false,
  },
};

export class GetBonusDetailService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { bonusId, userId, userBonusId, language } = this.filteredArgs;
    let data, query;

    try {
      const bonusDetails = await getOne({
        model: db.Bonus,
        data: { bonusId },
        attributes: [
          "bonusId",
          "bonusType",
          "daysToClear",
          "promotionTitle",
          "quantity",
          "validTo",
          "termCondition",
          "imageUrl",
          "depositBonusPercent",
          "validOnDays",
          "wageringMultiplier",
          "wageringRequirementType",
          "gameIds",
          "description",
          "currency",
          "appliedBonusId",
          "paymentMethods",
        ],
      });

      if (!bonusDetails)
        return this.addError(
          ERRORS.NOT_FOUND,
          "Bonus details " + ERROR_MSG.NOT_FOUND
        );

      data = { masterCasinoGameId: { [Op.in]: bonusDetails.gameIds } };

      bonusDetails.dataValues.isClaimed = false;

      if (userId) {
        const userBonus = await getOne({
          model: db.UserBonus,
          data: { userId, bonusId, issuerRole: ROLE.USER },
        });

        if (userBonus) {
          bonusDetails.dataValues.isClaimed = true;
          bonusDetails.dataValues.userBonus = userBonus;
        }
      }

      if (userBonusId) {
        const userBonus = await getOne({
          model: db.UserBonus,
          data: { userBonusId },
          attributes: ["userBonusId", "games", "freeSpinsQty", "expireAt"],
        });

        data = {};

        if (userBonus.games)
          query = { identifier: { [Op.in]: Object.keys(userBonus.games) } };

        bonusDetails.dataValues.quantity = userBonus.freeSpinsQty;
        bonusDetails.dataValues.validTo = userBonus.expireAt;
      }

      if (bonusDetails.bonusType === BONUS_TYPE.FREESPINS) {
        let gameList = await getAll({
          model: db.MasterCasinoGame,
          data: {
            ...data,
            [Op.and]: [{ operatorStatus: true }, { isActive: true }],
            ...query,
          },
          include: {
            model: db.MasterCasinoProvider,
            where: { [Op.and]: [{ isActive: true }] },
            required: true,
            attributes: ["name"],
          },
          attributes: [
            "name",
            "masterCasinoGameId",
            "masterCasinoProviderId",
            "identifier",
            "theme",
            "volatilityRating",
            "lines",
            "thumbnailUrl",
          ],
          raw: true,
        });

        if (userId) {
          const favoriteGame = await getAll({
            model: db.FavoriteGame,
            where: { userId },
            raw: true,
            attributes: ["masterCasinoGameId"],
          });
          gameList = mapFavoriteGame(gameList, favoriteGame);
        } else {
          gameList = mapFavoriteGame(gameList);
        }

        bonusDetails.dataValues.games = gameList;
      }

      const today = getDay();
      bonusDetails.dataValues.validToday =
        bonusDetails.validOnDays?.includes(today);
      bonusDetails.dataValues.promotionTitle =
        bonusDetails.dataValues.promotionTitle[language] ??
        bonusDetails.dataValues.promotionTitle[DEFAULT_LANGUAGE];
      bonusDetails.dataValues.termCondition =
        bonusDetails.dataValues.termCondition[language] ??
        bonusDetails.dataValues.termCondition[DEFAULT_LANGUAGE];
      bonusDetails.dataValues.description =
        bonusDetails.dataValues.description[language] ??
        bonusDetails.dataValues.description[DEFAULT_LANGUAGE];

      return { bonusDetails, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
