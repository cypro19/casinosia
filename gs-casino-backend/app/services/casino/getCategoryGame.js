import { Op, Sequelize } from "sequelize";
import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { pageValidation, getLocation } from "../../utils/common";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  limit: {
    presence: false,
  },
  pageNo: {
    presence: false,
  },
  subCategoryId: {
    format: {
      pattern: "^[0-9]+$",
      flags: "i",
      message: "can only be Integer.",
    },
    presence: { allowEmpty: false },
  },
  ipAddress: {
    presence: false,
  },
  userId: {
    presence: false,
  },
};

export class GetCategoryGamesService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { limit, pageNo, subCategoryId, ipAddress, userId } =
      this.filteredArgs;

    try {
      const { page, size } = pageValidation(pageNo, limit);

      const restricted = await getLocation(ipAddress);

      let games, providers;
      let attribute = [];

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

      let include = [
        {
          model: db.MasterCasinoProvider,
          where: { [Op.and]: [{ isActive: true }, providers] },
          required: true,
          attributes: ["name"],
        },
        {
          model: db.MasterGameSubCategory,
          attributes: ["name"],
        },
      ];

      if (userId) {
        include = [
          ...include,
          {
            model: db.FavoriteGame,
            where: { userId },
            attributes: [],
            required: false,
          },
        ];

        attribute = [
          [
            Sequelize.literal(
              '(SELECT case when "FavoriteGame"."favorite_game_id" IS NULL THEN false ELSE true END)'
            ),
            "isFavorite",
          ],
        ];
      }

      const categoryGames = await db.MasterCasinoGame.findAndCountAll({
        where: {
          [Op.and]: [
            { operatorStatus: true },
            { isActive: true },
            games,
            { masterGameSubCategoryId: subCategoryId },
          ],
        },
        include: include,
        attributes: [
          "masterCasinoGameId",
          "masterCasinoProviderId",
          "masterGameSubCategoryId",
          "orderId",
          ...attribute,
          "name",
          "identifier",
          "theme",
          "volatilityRating",
          "lines",
        ],
        order: [["orderId", "ASC"]],
        required: true,
        limit: size,
        offset: (page - 1) * size,
      });

      if (!categoryGames) {
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);
      }

      return { categoryGames, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
