import { Op } from "sequelize";
import db from "../../db/models";
import { getAll } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { mapFavoriteGame } from "../helper/casino";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { filterByGameSubCategory, pageValidation } from "../../utils/common";

const constraints = {
  limit: {
    presence: false,
  },
  pageNo: {
    presence: false,
  },
  category: {
    presence: false,
  },
  rating: {
    presence: false,
  },
  themes: {
    presence: false,
  },
  provider: {
    presence: false,
  },
  search: {
    presence: false,
  },
  userId: {
    presence: false,
  },
};

export class GetAllGamesService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let { limit, pageNo, rating, themes, category, provider, search, userId } =
      this.filteredArgs;

    try {
      let query = { isActive: true };
      const { page, size } = pageValidation(pageNo, limit);

      let categoryQuery, gamesQuery, themeQuery, providerQuery;

      if (search) query = filterByGameSubCategory(query, search);
      if (category) {
        if (typeof category !== "object") category = JSON.parse(category);
        if (category.length)
          categoryQuery = { masterGameSubCategoryId: { [Op.in]: category } };
      }
      if (provider) {
        if (typeof provider !== "object") provider = JSON.parse(provider);
        if (provider.length) providerQuery = { name: { [Op.in]: provider } };
      }
      if (rating) {
        if (typeof rating !== "object") rating = JSON.parse(rating);
        if (rating.length)
          gamesQuery = { volatilityRating: { [Op.in]: rating } };
      }
      if (themes) {
        if (typeof themes !== "object") themes = JSON.parse(themes);
        if (themes.length) themeQuery = { theme: { [Op.in]: themes } };
      }

      const include = [
        {
          model: db.MasterGameSubCategory,
          attributes: ["masterGameSubCategoryId", "name"],
          where: { ...categoryQuery, isActive: true },
          required: true,
        },
        {
          model: db.MasterCasinoProvider,
          where: { isActive: true, ...providerQuery },
          required: true,
          attributes: ["name"],
        },
      ];

      const categoryGames = await db.MasterCasinoGame.findAndCountAll({
        where: { ...query, operatorStatus: true, ...themeQuery, ...gamesQuery },
        order: [["masterCasinoGameId", "ASC"]],
        include: include,
        limit: size,
        offset: (page - 1) * size,
        attributes: [
          "masterCasinoGameId",
          "name",
          "thumbnailUrl",
          "masterCasinoProviderId",
          "identifier",
          "theme",
          "volatilityRating",
          "lines",
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
        categoryGames.rows = mapFavoriteGame(categoryGames.rows, favoriteGame);
      } else {
        categoryGames.rows = mapFavoriteGame(categoryGames.rows);
      }

      if (!categoryGames) {
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);
      }

      return { categoryGames, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
