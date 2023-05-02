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

export class CancelFreeSpinsService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let { payload } = this.filteredArgs;

    try {
      payload = { ...payload, casino_id: config.get("swissSoft.casinoId") };

      const gcpUrl = config.get("swissSoft.gcpUrl");
      const accessToken = config.get("swissSoft.accessToken");
      const token = hashGenerator({ data: payload, key: accessToken });

      try {
        await axios.post(`${gcpUrl}/freespins/cancel`, payload, {
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
