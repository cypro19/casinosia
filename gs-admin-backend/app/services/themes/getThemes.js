import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { pageValidation } from "../../utils/common";

const constraints = {
  pageNo: {
    presence: false,
  },
  limit: {
    presence: false,
  },
};

export class GetThemesService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { pageNo, limit } = this.filteredArgs;

    try {
      const { page, size } = pageValidation(pageNo, limit);

      const themes = await db.Theme.findAndCountAll({
        order: [["themeId", "ASC"]],
        limit: size,
        offset: (page - 1) * size,
      });

      if (!themes) return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { themes, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
