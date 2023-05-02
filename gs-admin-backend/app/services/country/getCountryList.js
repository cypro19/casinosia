import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { filterByName, pageValidation } from "../../utils/common";

const constraints = {
  limit: {
    presence: false,
  },
  pageNo: {
    presence: false,
  },
  name: {
    presence: false,
  },
};

export class GetCountryListService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let query;
    const { limit, pageNo, name } = this.filteredArgs;

    try {
      const { page, size } = pageValidation(pageNo, limit);

      if (name) query = filterByName(query, name);

      const countries = await db.Country.findAndCountAll({
        order: [["name", "ASC"]],
        limit: size,
        offset: (page - 1) * size,
        where: query,
        attributes: ["name", "countryId", "code"],
      });
      if (!countries)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { countries, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
