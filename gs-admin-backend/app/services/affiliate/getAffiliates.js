import db from "../../db/models";
import { ROLE } from "../../utils/constant";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { filterByNameEmail, pageValidation } from "../../utils/common";

const constraints = {
  limit: {
    presence: false,
  },
  pageNo: {
    presence: false,
  },
  userType: {
    presence: { allowEmpty: false },
  },
  user: {
    presence: false,
  },
  search: {
    presence: false,
  },
};

export class GetAffiliatesService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let query;
    const { limit, pageNo, userType, user, search } = this.filteredArgs;

    try {
      const { page, size } = pageValidation(pageNo, limit);

      if (search) {
        query = filterByNameEmail(query, search);
      }

      const affiliates = await db.Affiliate.findAndCountAll({
        where: query,
        order: [["createdAt", "DESC"]],
        limit: size,
        offset: (page - 1) * size,
        attributes: { exclude: ["password"] },
      });

      if (!affiliates)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { affiliates, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
