import ServiceBase from "../../common/serviceBase";
import { BANNER_KEYS } from "../../utils/constant";
import { ERRORS } from "../../utils/errors";

export class GetBannerKeys extends ServiceBase {
  async run() {
    try {
      return { bannerKey: BANNER_KEYS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
