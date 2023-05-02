import axios from "axios";
import db from "../../db/models";
import { getOne } from "../helper/crud";
import config from "../../../config/app";
import { secureData } from "../helper/casino";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { MAP_AGGREGATOR, MAP_GENDER, ROLE } from "../../utils/constant";

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
  user: {
    presence: { allowEmpty: false },
  },
  ipAddress: {
    presence: { allowEmpty: false },
  },
  language: {
    presence: { allowEmpty: false },
  },
};

export class InitGameService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { gameId, urls, user, deviceType, ipAddress, language } =
      this.filteredArgs;

    try {
      const microServiceUrl = config.get("microService.url");
      const microServiceAccessToken = config.get("microService.accessToken");

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

      const walletBalance = await getOne({
        model: db.Wallet,
        data: { ownerId: user.userId, ownerType: ROLE.USER },
        attributes: ["amount"],
      });

      const aggregator =
        MAP_AGGREGATOR[
          gameDetail.MasterCasinoProvider.MasterGameAggregator.name
        ];

      const payload = {
        game: gameDetail.identifier,
        currency: user.currencyCode,
        locale: language ?? "en",
        ip: ipAddress,
        client_type: deviceType,
        balance: walletBalance.amount,
        urls,
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
        jurisdiction: user.countryCode, // optional
      };

      const token = secureData({ data: payload, key: microServiceAccessToken });

      let gameData;
      try {
        gameData = await axios.post(
          `${microServiceUrl}/${aggregator}/init`,
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
