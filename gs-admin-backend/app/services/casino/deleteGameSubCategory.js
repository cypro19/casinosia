import db from "../../db/models";
import { getOne } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  masterGameSubCategoryId: {
    presence: { allowEmpty: false },
  },
  user: {
    presence: { allowEmpty: false },
  },
};

export class DeleteGameSubCategoryService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { masterGameSubCategoryId, user } = this.filteredArgs;

    try {
      const checkGameSubCategoryExists = await getOne({
        model: db.MasterGameSubCategory,
        data: { masterGameSubCategoryId },
        include: { model: db.MasterGameCategory },
      });

      if (checkGameSubCategoryExists == null) {
        return this.addError(
          ERRORS.BAD_DATA,
          "Game Sub Category" + ERROR_MSG.NOT_FOUND
        );
      }
      await checkGameSubCategoryExists.destroy();
      return { success: true, message: SUCCESS_MSG.DELETE_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
