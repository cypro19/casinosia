import db from "../../db/models";
import { getAll } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import { filterByName } from "../../utils/common";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  providerId: {
    presence: false,
  },
  search: {
    presence: false,
  },
};

export class GetAllCasinoGamesService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let query;
    const { providerId, search } = this.filteredArgs;

    try {
      if (providerId) query = { masterCasinoProviderId: providerId };
      if (search) query = filterByName(query, search);

      const games = await getAll({
        model: db.MasterCasinoGame,
        data: query,
        attributes: [
          "masterCasinoGameId",
          "name",
          "masterCasinoProviderId",
          "wageringContribution",
          "returnToPlayer",
        ],
      });

      if (!games) {
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);
      }

      return { games, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
