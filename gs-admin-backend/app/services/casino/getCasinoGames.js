import { Op } from "sequelize";
import db from "../../db/models";
import { getAll, getOne } from "../helper/crud";
import { ROLE } from "../../utils/constant";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { pageValidation, filterByName } from "../../utils/common";

const constraints = {
  limit: {
    presence: false,
  },
  pageNo: {
    presence: false,
  },
  user: {
    presence: false,
  },
  isActive: {
    inclusion: {
      within: ["true", "false", "", null],
      message: "can be true or false",
    },
    presence: false,
  },
  search: {
    presence: false,
  },
  casinoCategoryId: {
    presence: false,
  },
  userType: {
    presence: false,
  },
  freespins: {
    inclusion: {
      within: ["true", "", null],
    },
  },
  bonusId: {
    presence: false,
  },
  providerId: {
    presence: false,
  },
};

export class GetCasinoGamesService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let query;
    const {
      limit,
      pageNo,
      user,
      isActive,
      search,
      casinoCategoryId,
      userType,
      providerId,
      freespins,
      bonusId,
    } = this.filteredArgs;
    let casinoGames, page, size;

    try {
      if (pageNo && limit) {
        const values = pageValidation(pageNo, limit);
        page = values.page;
        size = values.size;
      }

      let include;
      let model = db.MasterCasinoGame;

      if (search) query = filterByName(query, search);
      if (isActive && (isActive !== "" || isActive !== null))
        query = { ...query, isActive };

      if (userType === ROLE.SUPERADMIN) {
        if (casinoCategoryId)
          query = { ...query, masterGameSubCategoryId: casinoCategoryId };
      } else if (userType === ROLE.ADMIN && user) {
        if (casinoCategoryId) {
          const categoryGames = await getAll({
            model: db.CategoryGame,
            data: { masterGameSubCategoryId: casinoCategoryId },
            attributes: ["masterCasinoGameId"],
          });

          const result = await categoryGames.map((x) => x.masterCasinoGameId);
          query = { ...query, masterCasinoGameId: { [Op.notIn]: result } };
        }
      }

      if (providerId) query = { ...query, masterCasinoProviderId: providerId };
      if (freespins) {
        if (bonusId) {
          const gameList = await getOne({
            model: db.Bonus,
            data: { bonusId },
            attributes: ["gameIds"],
          });

          if (!gameList)
            return this.addError(
              ERRORS.NOT_FOUND,
              "Bonus " + ERROR_MSG.NOT_FOUND
            );
          query = {
            ...query,
            masterCasinoGameId: { [Op.notIn]: gameList.gameIds },
          };
        }
        query = { ...query, hasFreespins: true };
      }

      if (page && size) {
        casinoGames = await model.findAndCountAll({
          where: query,
          order: [["createdAt", "DESC"]],
          limit: size,
          offset: (page - 1) * size,
          include: include,
        });
      } else {
        casinoGames = await getAll({
          model,
          data: query,
          order: [["createdAt", "DESC"]],
          include: include,
        });
      }

      if (!casinoGames) {
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);
      }

      return { casinoGames, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
