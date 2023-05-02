import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { ROLE } from "../../utils/constant";
import { getAll } from "../helper/crud";
import { getXlsFileName } from "../helper/email";
import { createLanguageSupportKeysCsv } from "../helper/csv";

const constraints = {
  userType: {
    presence: { allowEmpty: false },
  },
  language: {
    presence: false,
  },
  csvDownload: {
    presence: false,
  },
};

export class GetLanguageSupportService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let { userType, language, csvDownload } = this.filteredArgs;

    try {
      let query = {};

      if (language) {
        query = { ...query, language };
      }

      let attributes = null;

      if (csvDownload) {
        attributes = {
          exclude: ["multiLanguageSupportId", "createdAt", "updatedAt"],
        };
      }

      const languageData = await getAll({
        model: db.MultiLanguageSupport,
        data: query,
        attributes,
        raw: true,
      });

      if (csvDownload && languageData.length !== 0) {
        const xlsx = require("node-xlsx");
        const { fields, data } = createLanguageSupportKeysCsv(languageData);
        const csvData = xlsx.build([
          { name: getXlsFileName(), data: [fields, ...data] },
        ]);

        return { csv: true, csvData, fileName: getXlsFileName() };
      }

      return { languageData, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
