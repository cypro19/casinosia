import { Op, Sequelize } from "sequelize";

import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { pageValidation, getLocation } from "../../utils/common";

const constraints = {
  id: {
    presence: { allowEmpty: false },
  },
  limit: {
    presence: false,
  },
  pageNo: {
    presence: false,
  },
  ipAddress: {
    presence: false,
  },
};

export class GetFavoriteGamesService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { id, limit, pageNo, ipAddress } = this.filteredArgs;

    try {
      const { page, size } = pageValidation(pageNo, limit);

      const restricted = await getLocation(ipAddress);

      let games, providers;

      if (!restricted)
        return this.addError(
          ERRORS.NOT_FOUND,
          "Country " + ERROR_MSG.NOT_FOUND
        );

      if (restricted.restrictedGames) {
        games = {
          masterCasinoGameId: { [Op.notIn]: restricted.restrictedGames },
        };
      }

      if (restricted.restrictedProviders) {
        providers = {
          masterCasinoProviderId: {
            [Op.notIn]: restricted.restrictedProviders,
          },
        };
      }

      const favoriteGames = await db.FavoriteGame.findAndCountAll({
        where: { userId: id },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["createdAt", "updatedAt"],
          include: [
            [
              Sequelize.literal(
                '(SELECT case when "FavoriteGame"."favorite_game_id" IS NULL THEN false ELSE true END)'
              ),
              "isFavorite",
            ],
            "userId",
            "masterCasinoGameId",
          ],
        },
        include: [
          {
            model: db.MasterCasinoGame,
            where: {
              [Op.and]: [{ operatorStatus: true }, { isActive: true }, games],
            },
            include: [
              { model: db.MasterGameSubCategory, attributes: ["name"] },
              {
                model: db.MasterCasinoProvider,
                where: { [Op.and]: [{ isActive: true }, providers] },
                attributes: ["name"],
                required: true,
              },
            ],
            attributes: [
              "name",
              "masterCasinoProviderId",
              "identifier",
              "theme",
              "volatilityRating",
              "lines",
              "thumbnailUrl",
            ],
            as: "CategoryGames",
            required: true,
          },
        ],
        limit: size,
        offset: (page - 1) * size,
      });

      if (!favoriteGames) {
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);
      }

      return { favoriteGames, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
