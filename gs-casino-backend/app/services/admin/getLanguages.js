import db from "../../db/models";
import { getAll } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

export class GetLanguageService extends ServiceBase {
  async run() {
    try {
      const languages = await getAll({
        model: db.Language,
        data: { isActive: true },
      });

      if (!languages)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { languages, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
