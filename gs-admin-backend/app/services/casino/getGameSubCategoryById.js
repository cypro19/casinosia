import db from "../../db/models";
import { getOne } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  user: {
    presence: { allowEmpty: false },
  },
  casinoSubCategoryId: {
    format: {
      pattern: "^[0-9]+$",
      flags: "i",
      message: "can only be Integer.",
    },
    presence: { allowEmpty: false },
  },
};

export class GetGameSubCategoryService extends ServiceBase {
  get constraints() {
    return constraints;
  }
  async run() {
    const { user, casinoSubCategoryId } = this.filteredArgs;

    try {
      const query = { masterGameSubCategoryId: casinoSubCategoryId };

      const casinoSubCategory = await getOne({
        model: db.MasterGameSubCategory,
        data: query,
        include: [{ model: db.MasterGameCategory }],
      });

      if (!casinoSubCategory)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { casinoSubCategory, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
