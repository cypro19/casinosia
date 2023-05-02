import ServiceBase from "../../common/serviceBase";
import {
  EMAIL_DYNAMIC_OPTIONS,
  EMAIL_TEMPLATES_KEYS,
  EMAIL_TEMPLATE_TYPES,
} from "../../utils/constant";
import { ERRORS } from "../../utils/errors";
import { setEmailKeyDescription } from "../helper/email";

export class GetEmailDynamicDetails extends ServiceBase {
  async run() {
    try {
      return {
        emailTypes: EMAIL_TEMPLATE_TYPES,
        dynamicKeys: EMAIL_TEMPLATES_KEYS,
        keyDescription: setEmailKeyDescription(EMAIL_DYNAMIC_OPTIONS),
      };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
