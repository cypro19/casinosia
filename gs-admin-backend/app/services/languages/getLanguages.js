import db from "../../db/models";
import { getAll } from "../helper/crud";
import { ERRORS } from "../../utils/errors";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";

const constraints = {};

export class GetLanguagesService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const {} = this.filteredArgs;

    try {
      const getLanguages = await getAll({
        model: db.Configuration,
        attributes: ["allowedLanguages"],
      });

      let languages = [];
      getLanguages.map((site) => {
        languages = [...languages, ...site.allowedLanguages];
      });

      const languageSet = new Set(languages);

      return {
        languages: Array.from(languageSet.values()),
        message: SUCCESS_MSG.GET_SUCCESS,
      };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
