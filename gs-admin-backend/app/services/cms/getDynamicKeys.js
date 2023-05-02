import ServiceBase from "../../common/serviceBase";
import { CMS_DYNAMIC_OPTIONS, CMS_ALLOWED_KEYS } from "../../utils/constant";
import { ERRORS } from "../../utils/errors";
import { setEmailKeyDescription } from "../helper/email";

export class GetCmsDynamicKeys extends ServiceBase {
  async run() {
    try {
      return {
        dynamicKeys: CMS_ALLOWED_KEYS,
        keyDescription: setEmailKeyDescription(CMS_DYNAMIC_OPTIONS),
      };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
