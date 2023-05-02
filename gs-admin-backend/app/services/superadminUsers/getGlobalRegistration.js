import db from "../../db/models";
import { getOne } from "../helper/crud";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { STRICTLY_REQUIRED_REGISTRATION_FIELDS } from "../../utils/constant";

export class GetGlobalRegistrationService extends ServiceBase {
  async run() {
    try {
      const globalRegistration = await getOne({
        model: db.GlobalSetting,
        data: { key: "GLOBAL_REGISTRATION" },
      });

      if (!globalRegistration)
        return this.addError(
          ERRORS.BAD_DATA,
          "Global registration " + ERROR_MSG.NOT_EXISTS
        );

      return {
        ...JSON.parse(globalRegistration.value),
        disable: STRICTLY_REQUIRED_REGISTRATION_FIELDS,
      };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
