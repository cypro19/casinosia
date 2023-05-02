import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

export class GetAllCountriesService extends ServiceBase {
  async run() {
    try {
      const countries = await db.Country.findAndCountAll({
        order: [["name", "ASC"]],
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
