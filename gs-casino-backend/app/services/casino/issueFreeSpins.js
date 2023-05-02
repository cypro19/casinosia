import axios from "axios";
import config from "../../../config/app";
import { secureData } from "../helper/casino";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { LEVEL, MAP_AGGREGATOR, MAP_GENDER } from "../../utils/constant";

const constraints = {
  user: {
    presence: { allowEmpty: false },
  },
  freeSpinsQuantity: {
    presence: { allowEmpty: false },
  },
  games: {
    presence: { allowEmpty: false },
  },
  validUntilDays: {
    presence: { allowEmpty: false },
  },
  betLevel: {
    presence: false,
  },
};

export class IssueFreeSpinService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let { user, games, freeSpinsQuantity, validUntilDays, betLevel } =
      this.filteredArgs;

    try {
      if (!betLevel) betLevel = LEVEL;

      const payload = {
        issue_id: `${user.dataValues.issueId}`,
        currency: user.currencyCode,
        games,
        bet_level: betLevel,
        valid_until: validUntilDays.toISOString(),
        freespins_quantity: freeSpinsQuantity,
        user: {
          id: `${user.uniqueId}`,
          external_id: `${user.uniqueId}`, //  optional
          firstname: user.firstName,
          lastname: user.lastName,
          nickname: user.firstName,
          city: user.city,
          date_of_birth: user.dateOfBirth.toISOString().substring(0, 10),
          registered_at: user.createdAt.toISOString().substring(0, 10),
          gender: MAP_GENDER[user.gender],
          country: user.countryCode,
        },
      };

      const token = secureData({
        data: payload,
        key: config.get("microService.accessToken"),
      });

      let gameData;
      try {
        gameData = await axios.post(
          `${config.get("microService.url")}/${
            MAP_AGGREGATOR.softswiss
          }/issue-freeSpins`,
          payload,
          {
            headers: { "MICRO-SERVICE-REQUEST-SIGN": token },
          }
        );
      } catch {
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
    } catch (error) {
      return {
        err_type: ERRORS.INTERNAL,
        err: ERROR_MSG.SERVER_ERROR,
        success: false,
      };
    }
  }
}
