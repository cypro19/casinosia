import db from "../../db/models";
import { getOne } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  masterGameCategoryId: {
    presence: { allowEmpty: false },
  },
  user: {
    presence: { allowEmpty: false },
  },
};

export class DeleteGameCategoryService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { masterGameCategoryId, user } = this.filteredArgs;

    try {
      const checkCategoryGameExists = await getOne({
        model: db.MasterGameCategory,
        data: {
          masterGameCategoryId,
          masterGameCategoryId: masterGameCategoryId,
        },
      });

      if (checkCategoryGameExists == null) {
        return this.addError(
          ERRORS.BAD_DATA,
          "Game Category" + ERROR_MSG.NOT_FOUND
        );
      }

      await checkCategoryGameExists.destroy();

      return { success: true, message: SUCCESS_MSG.DELETE_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
