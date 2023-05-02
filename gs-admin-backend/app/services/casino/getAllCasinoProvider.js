import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { pageValidation } from "../../utils/common";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  limit: {
    presence: false,
  },
  pageNo: {
    presence: false,
  },
};

export class GetMasterCasinoProvidersService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { limit, pageNo } = this.filteredArgs;

    try {
      const { page, size } = pageValidation(pageNo, limit);

      let casinos;
      if (pageNo && limit) {
        casinos = await db.MasterCasinoProvider.findAndCountAll({
          order: [["masterCasinoProviderId", "ASC"]],
          limit: size,
          offset: (page - 1) * size,
        });
      } else {
        casinos = await db.MasterCasinoProvider.findAndCountAll({
          order: [["masterCasinoProviderId", "ASC"]],
          attributes: [
            "masterCasinoProviderId",
            "name",
            "masterGameAggregatorId",
          ],
        });
      }

      if (!casinos) {
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);
      }

      return { casinos, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
