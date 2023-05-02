import db from "../../db/models";
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
  userType: {
    presence: false,
  },
  search: {
    presence: false,
  },
  isActive: {
    inclusion: {
      within: ["true", "false", "", null],
      message: "can be true or false",
    },
    presence: false,
  },
};

export class GetAllGameCategoryService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { limit, pageNo, user, userType, search, isActive } =
      this.filteredArgs;

    try {
      let query;
      const model = db.MasterGameCategory;
      const order = [["createdAt", "DESC"]];
      const attributes = ["masterGameCategoryId", "name", "isActive"];

      const { page, size } = pageValidation(pageNo, limit);

      if (search) query = filterByName(query, search);

      query = { ...query };
      if (isActive && (isActive !== "" || isActive !== null)) {
        query = { ...query, isActive };
      }
      let casinoCategories;
      if (pageNo && limit) {
        casinoCategories = await model.findAndCountAll({
          where: query,
          order: order,
          limit: size,
          offset: (page - 1) * size,
        });
      } else {
        casinoCategories = await model.findAndCountAll({
          where: query,
          order: order,
          attributes,
        });
      }
      if (!casinoCategories)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { casinoCategories, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
