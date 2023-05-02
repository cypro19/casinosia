import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { filterByLanguageName, pageValidation } from "../../utils/common";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  limit: {
    presence: false,
  },
  pageNo: {
    presence: false,
  },
  name: {
    presence: false,
  },
};

export class GetLanguagesService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let query, languages;
    const { limit, pageNo, name } = this.filteredArgs;

    try {
      const { page, size } = pageValidation(pageNo, limit);

      if (name) query = filterByLanguageName(query, name);

      if (pageNo && limit) {
        languages = await db.Language.findAndCountAll({
          order: [["languageId", "ASC"]],
          limit: size,
          offset: (page - 1) * size,
          where: query,
        });
      } else {
        languages = await db.Language.findAndCountAll({
          order: [["languageId", "ASC"]],
          attributes: ["languageId", "languageName", "code"],
          where: query,
        });
      }

      if (!languages)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { languages, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
