import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

export class GetAllProvidersService extends ServiceBase {
  async run() {
    try {
      const providerList = await db.MasterCasinoProvider.findAndCountAll({
        order: [["name", "ASC"]],
        attributes: ["name", "masterCasinoProviderId", "isActive"],
      });

      if (!providerList) {
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);
      }

      return { providerList, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
