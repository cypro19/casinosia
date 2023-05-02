import axios from "axios";
import db from "../../db/models";
import { getOne } from "../helper/crud";
import config from "../../../config/app";
import { secureData } from "../helper/casino";
import { getLocation } from "../../utils/common";
import ServiceBase from "../../common/serviceBase";
import { MAP_AGGREGATOR } from "../../utils/constant";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  gameId: {
    type: "integer",
    presence: { allowEmpty: false },
  },
  deviceType: {
    inclusion: {
      within: ["mobile", "desktop", "detect"],
      message: "can be (mobile/desktop)",
    },
    presence: { allowEmpty: false },
  },
  urls: {
    presence: { allowEmpty: false },
  },
  ipAddress: {
    presence: { allowEmpty: false },
  },
  language: {
    presence: { allowEmpty: false },
  },
};

export class DemoGameService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { gameId, deviceType, urls, ipAddress, language } = this.filteredArgs;

    try {
      const microServiceUrl = config.get("microService.url");
      const microServiceAccessToken = config.get("microService.accessToken");

      const country = await getLocation(ipAddress);

      const gameDetail = await getOne({
        model: db.MasterCasinoGame,
        data: { masterCasinoGameId: gameId },
        attributes: ["identifier"],
        include: [
          {
            model: db.MasterCasinoProvider,
            attributes: ["name", "isActive"],
            include: [
              {
                model: db.MasterGameAggregator,
                attributes: ["name", "isActive"],
              },
            ],
          },
        ],
      });

      if (!gameDetail)
        return this.addError(ERRORS.NOT_FOUND, "Game " + ERROR_MSG.NOT_EXISTS);

      const aggregator =
        MAP_AGGREGATOR[
          gameDetail.MasterCasinoProvider.MasterGameAggregator.name
        ];
      const payload = {
        game: gameDetail.identifier,
        locale: language ?? "en",
        ip: ipAddress,
        client_type: deviceType,
        urls,
        jurisdiction: country?.code || "IN", // Temporary country code
      };
      const token = secureData({ data: payload, key: microServiceAccessToken });

      let gameData;
      try {
        gameData = await axios.post(
          `${microServiceUrl}/${aggregator}/demo`,
          payload,
          {
            headers: { "MICRO-SERVICE-REQUEST-SIGN": token },
          }
        );
      } catch {
        return this.addError(ERRORS.BAD_REQUEST, ERROR_MSG.EXTERNAL_API_ERROR);
      }

      if (!gameData)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      const data = gameData.data.data;
      return { ...data };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
