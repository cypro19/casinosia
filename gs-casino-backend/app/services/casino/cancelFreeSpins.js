import axios from "axios";
import config from "../../../config/app";
import { secureData } from "../helper/casino";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { MAP_AGGREGATOR } from "../../utils/constant";

const constraints = {
  issueId: {
    presence: { allowEmpty: false },
  },
};

export class CancelFreeSpinService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { issueId } = this.filteredArgs;
    let gameData;

    try {
      const payload = {
        issue_id: issueId,
      };

      const token = secureData({
        data: payload,
        key: config.get("microService.accessToken"),
      });

      try {
        gameData = await axios.post(
          `${config.get("microService.url")}/${
            MAP_AGGREGATOR.softswiss
          }/cancel-freeSpins`,
          payload,
          {
            headers: { "MICRO-SERVICE-REQUEST-SIGN": token },
          }
        );
      } catch (error) {
        return {
          err_type: ERRORS.BAD_REQUEST,
          err: ERROR_MSG.EXTERNAL_API_ERROR,
          success: false,
        };
      }

      if (!gameData)
        return {
          err_type: ERRORS.NOT_FOUND,
          err: "Game data " + ERROR_MSG.NOT_FOUND,
          success: false,
        };

      const data = gameData.data.data;
      return { err: null, success: true, data };
    } catch {
      return {
        err_type: ERRORS.INTERNAL,
        err: ERROR_MSG.SERVER_ERROR,
        success: false,
      };
    }
  }
}
