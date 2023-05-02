import db from "../../db/models";
import { getOne } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  categoryGameId: {
    presence: { allowEmpty: false },
  },
};

export class DeleteCategoryGameService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { categoryGameId } = this.filteredArgs;

    try {
      const checkCategoryGameExists = await getOne({
        model: db.CategoryGame,
        data: { categoryGameId },
      });

      if (checkCategoryGameExists == null) {
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.NOT_FOUND);
      }

      await checkCategoryGameExists.destroy();

      return { success: true, message: SUCCESS_MSG.DELETE_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
