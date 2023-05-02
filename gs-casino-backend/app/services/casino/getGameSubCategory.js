import { Op } from "sequelize";
import db from "../../db/models";
import { getAll, getOne } from "../helper/crud";
import { getLocation } from "../../utils/common";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  categoryId: {
    presence: { allowEmpty: false },
  },
  ipAddress: {
    presence: false,
  },
  userId: {
    presence: false,
  },
};

export class GetGameSubCategoryService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { categoryId, ipAddress, userId } = this.filteredArgs;
    const defaultGames = 6;
    const defaultGamesOffset = 0;
    const query = { masterGameSubCategoryId: categoryId, isActive: true };

    let games, providers;

    try {
      const restricted = await getLocation(ipAddress);

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

      const masterGameSubCategory = await getOne({
        model: db.MasterGameSubCategory,
        data: { masterGameSubCategoryId: categoryId },
        attributes: ["isActive"],
      });

      if (!masterGameSubCategory?.isActive)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      let response;

      const subCategories = await db.MasterGameSubCategory.findOne({
        where: query,
        order: [["orderId"]],
        attributes: ["name"],
        include: {
          model: db.MasterCasinoGame,
          where: {
            [Op.and]: [{ operatorStatus: true }, { isActive: true }, games],
          },
          include: {
            model: db.MasterCasinoProvider,
            where: { [Op.and]: [{ isActive: true }, providers] },
            attributes: ["name"],
            required: true,
          },
          limit: defaultGames,
          offset: defaultGamesOffset,
          required: true,
          order: [["orderId", "asc"]],
        },
      });

      if (!subCategories)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      response = { subCategories };

      if (userId) {
        const favoriteGame = await getAll({
          model: db.FavoriteGame,
          where: { userId },
          raw: true,
          attributes: ["masterCasinoGameId"],
        });

        for (
          let index = 0;
          index < response.subCategories?.MasterCasinoGames?.length;
          index++
        ) {
          response.subCategories.MasterCasinoGames[
            index
          ].dataValues.isFavorite = !!favoriteGame.find(
            (favGame) =>
              favGame.masterCasinoGameId ===
              response.subCategories.MasterCasinoGames[index].masterCasinoGameId
          );
        }

        const favoriteGames = await db.FavoriteGame.findAndCountAll({
          where: { userId },
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: db.MasterCasinoGame,
              as: "CategoryGames",
              where: {
                [Op.and]: [{ operatorStatus: true }, { isActive: true }, games],
              },
              attributes: [
                "masterCasinoGameId",
                "operatorStatus",
                "isActive",
                "identifier",
                "thumbnailUrl",
                "theme",
                "volatilityRating",
                "lines",
              ],
              include: {
                model: db.MasterCasinoProvider,
                where: { [Op.and]: [{ isActive: true }, providers] },
                attributes: ["masterCasinoProviderId", "name", "isActive"],
                required: true,
              },
              required: true,
            },
          ],
          limit: defaultGames,
          offset: defaultGamesOffset,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        });

        if (favoriteGames) {
          response = { ...response, favoriteGames };
        }
      }

      return { ...response, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
