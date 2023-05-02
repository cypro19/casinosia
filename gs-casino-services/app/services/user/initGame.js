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

export class InitGameService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let gameData;
    let { payload } = this.filteredArgs;

    try {
      payload = { ...payload, casino_id: config.get("swissSoft.casinoId") };

      const gcpUrl = config.get("swissSoft.gcpUrl");
      const accessToken = config.get("swissSoft.accessToken");
      const token = hashGenerator({ data: payload, key: accessToken });

      try {
        gameData = await axios.post(`${gcpUrl}/sessions`, payload, {
          headers: { "X-REQUEST-SIGN": token },
        });
      } catch {
        return this.addError(ERRORS.BAD_REQUEST, ERROR_MSG.CASINO_END_ERROR);
      }

      if (!gameData)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { ...gameData.data, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
