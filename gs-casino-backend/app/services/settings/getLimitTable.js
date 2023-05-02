import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS } from "../../utils/errors";
import { getLimitTable } from "../helper/casino";

const constraints = {
  id: {
    presence: { allowEmpty: false },
  },
};

export class GetLimitTableService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { id } = this.filteredArgs;

    try {
      const limitTable = await getLimitTable(id);

      return { limitTable, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
