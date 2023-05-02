import db from "../../db/models";
import { getOne } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  currencyId: {
    presence: true,
  },
};

export class GetCurrencyDetailService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { currencyId } = this.filteredArgs;

    try {
      const currencyDetail = await getOne({
        model: db.Currency,
        data: { currencyId },
      });

      if (!currencyDetail)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { currencyDetail, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
