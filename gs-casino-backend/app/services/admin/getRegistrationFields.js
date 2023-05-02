import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { getGlobalRegistration } from "../../utils/common";

export class GetRegistrationFieldService extends ServiceBase {
  async run() {
    try {
      const globalRegistration = await getGlobalRegistration();

      if (!globalRegistration)
        return this.addError(
          ERRORS.BAD_DATA,
          "Global registration " + ERROR_MSG.NOT_EXISTS
        );

      return { ...globalRegistration, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
