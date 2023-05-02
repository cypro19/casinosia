import db from "../../db/models";
import { getOne } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  themeId: { presence: true },
};

export class GetThemeDetailService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { themeId } = this.filteredArgs;

    try {
      const themeDetail = await getOne({ model: db.Theme, data: { themeId } });

      if (!themeDetail)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { themeDetail, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
