import db from "../../db/models";
import { ROLE } from "../../utils/constant";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { pageValidation, filterByName } from "../../utils/common";
import { stubFalse } from "lodash";
import { Op } from "sequelize";

const constraints = {
  limit: {
    presence: false,
  },
  pageNo: {
    presence: false,
  },
  gameCategoryId: {
    presence: false,
  },
  language: {
    presence: stubFalse,
  },
  search: {
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
  sort: {
    presence: false,
  },
  orderBy: {
    presence: false,
  },
  userType: {
    presence: false,
  },
};

export class GetAllGameSubCategoryService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let {
      limit,
      pageNo,
      gameCategoryId,
      language,
      search,
      user,
      isActive,
      userType,
      orderBy,
      sort,
    } = this.filteredArgs;

    try {
      const { page, size } = pageValidation(pageNo, limit);

      let query, include;
      const model = db.MasterGameSubCategory;
      let attributes = [
        "masterGameSubCategoryId",
        "name",
        "masterGameCategoryId",
        "isActive",
      ];

      if (isActive && (isActive !== "" || isActive !== null))
        query = { ...query, isActive };
      if (!sort || sort === "") sort = "DESC";
      if (!orderBy || orderBy === "") orderBy = "masterGameSubCategoryId";

      let order = [["orderId", "ASC"]];
      if (userType === ROLE.SUPERADMIN) {
        if (search) {
          if (!language) language = "EN";
          query = {
            ...query,
            name: { [`${language}`]: { [Op.iLike]: `%${search}%` } },
          };
        }
        //if (search) query = filterByName(query, search)
        order = [[orderBy || "createdAt", sort || "ASC"]];
        // attributes = ['name', 'masterGameCategoryId', 'masterGameSubCategoryId', 'isActive']

        include = [{ model: db.MasterGameCategory, attributes: ["name"] }];
        attributes = ["name", "masterGameSubCategoryId", "isActive"];
        if (gameCategoryId) query = { ...query };
        //}
      }

      let casinoSubCategories;
      if (pageNo && limit) {
        casinoSubCategories = await model.findAndCountAll({
          where: query,
          order: order,
          limit: size,
          offset: (page - 1) * size,
          include: include,
        });
      } else {
        casinoSubCategories = await model.findAndCountAll({
          where: query,
          order: order,
          include: include,
          attributes,
        });
      }
      if (!casinoSubCategories)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { casinoSubCategories, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
