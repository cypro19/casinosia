import axios from "axios";

import config from "../../../config/app";
import { hashGenerator } from "../common/casino";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG, SUCCESS_MSG } from "../../utils/responseMessage";

const constraints = {
  payload: {
    presence: { allowEmpty: false },
  },
};

export class IssueFreeSpinsService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let { payload } = this.args;

    try {
      payload = { ...payload, casino_id: config.get("swissSoft.casinoId") };

      const gcpUrl = config.get("swissSoft.gcpUrl");
      const accessToken = config.get("swissSoft.accessToken");
      const token = hashGenerator({ data: payload, key: accessToken });

      try {
        await axios.post(`${gcpUrl}/freespins/issue`, payload, {
          headers: { "X-REQUEST-SIGN": token },
        });
      } catch {
        return this.addError(ERRORS.BAD_REQUEST, ERROR_MSG.CASINO_END_ERROR);
      }

      return { success: true, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
