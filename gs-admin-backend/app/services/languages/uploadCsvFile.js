import ServiceBase from "../../common/serviceBase";
import { ERRORS } from "../../utils/errors";
import {
  checkKeysExists,
  checkLanguageExistsInDb,
  filterFileData,
  insertIntoDb,
} from "../helper/language";
import { ROLE } from "../../utils/constant";

const constraints = {
  languageCsv: {
    presence: { allowEmpty: false },
  },
  userType: {
    presence: { allowEmpty: false },
  },
};

export class LoadLanguagesCsvService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { languageCsv, userType } = this.filteredArgs;

    try {
      if (
        typeof languageCsv === "object" &&
        languageCsv.mimetype === "application/vnd.ms-excel"
      ) {
        const xlsx = require("node-xlsx");
        const data = xlsx.parse(languageCsv.buffer)[0].data;

        // To check Language in excel sheet matches language allowed to admin
        const { error, success } = await checkLanguageExistsInDb(data[0]);
        if (!success) return this.addError(ERRORS.BAD_REQUEST, error);

        // To check language support keys present in excel sheet matches allowed keys
        const keyExists = await checkKeysExists(data);
        if (!keyExists.success)
          return this.addError(ERRORS.BAD_REQUEST, keyExists.error);

        // To convert data in format of database storage
        const filteredData = await filterFileData(data);

        if (userType === ROLE.ADMIN) {
          await insertIntoDb(filteredData);
        } else if (userType === ROLE.SUPERADMIN) {
          await insertIntoDb(filteredData);
        }

        return { success: true };
      } else {
        return this.addError(
          ERRORS.BAD_REQUEST,
          "Only xls format sheet is allowed"
        );
      }
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
