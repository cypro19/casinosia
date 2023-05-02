import db from "../../db/models";
import { getAll } from "../helper/crud";
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
  isActive: {
    inclusion: {
      within: ["true", "false", "", null],
      message: "can be true or false",
    },
    presence: false,
  },
  orderBy: {
    presence: false,
  },
  user: {
    presence: { allowEmpty: false },
  },
  sort: {
    presence: false,
  },
  casinoCategoryId: {
    presence: false,
  },
  search: {
    presence: false,
  },
  providerId: {
    presence: false,
  },
};

export class GetCategoryGamesService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let {
      limit,
      pageNo,
      isActive,
      orderBy,
      casinoCategoryId,
      user,
      search,
      sort,
      providerId,
    } = this.filteredArgs;
    let categoryGames, page, size, query;
    const model = db.MasterCasinoGame;
    const include = [
      {
        model: db.MasterGameSubCategory,
        attributes: ["name", "isActive"],
        include: [
          {
            model: db.MasterGameCategory,
            attributes: ["name", "isActive", "masterGameCategoryId"],
          },
        ],
      },
    ];

    try {
      if (pageNo && limit) {
        const values = pageValidation(pageNo || 1, limit);
        page = values.page;
        size = values.size;
      }

      if (orderBy === "categoryGameId") {
        orderBy = "masterGameSubCategoryId";
      }
      if (isActive && (isActive !== "" || isActive !== null))
        query = { ...query, isActive };
      if (casinoCategoryId)
        query = { ...query, masterGameSubCategoryId: casinoCategoryId };
      if (search) query = filterByName(query, search);
      if (!sort || sort === "") sort = "DESC";
      if (!orderBy || orderBy === "") orderBy = "masterGameSubCategoryId";
      if (providerId) query = { ...query, masterCasinoProviderId: providerId };

      query = { ...query };

      if (page && size) {
        categoryGames = await model.findAndCountAll({
          where: query,
          order: [[orderBy || "created_at", sort]],
          limit: size,
          offset: +((page - 1) * size),
          include,
        });
      } else {
        categoryGames = await getAll({
          model,
          data: query,
          include,
          order: [["masterGameSubCategoryId", "ASC"]],
        });
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
