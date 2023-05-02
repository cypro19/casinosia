import { Op } from "sequelize";
import db from "../../db/models";
import { getOne } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { pageValidation, filterByName } from "../../utils/common";

const constraints = {
  bonusId: {
    presence: { presence: false },
  },
  limit: {
    presence: false,
  },
  pageNo: {
    presence: false,
  },
  providerId: {
    presence: false,
  },
  search: {
    presence: false,
  },
};

export class GetFreespinGamesService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { bonusId, limit, pageNo, providerId, search } = this.filteredArgs;

    try {
      let query;
      const { page, size } = pageValidation(pageNo, limit);

      if (search) query = filterByName(query, search);
      if (providerId) query = { ...query, masterCasinoProviderId: providerId };

      const gameList = await getOne({
        model: db.Bonus,
        data: { bonusId },
        attributes: ["gameIds"],
      });

      if (!gameList)
        return this.addError(ERRORS.NOT_FOUND, "Bonus " + ERROR_MSG.NOT_FOUND);

      if (!gameList.gameIds) {
        return this.addError(ERRORS.NOT_FOUND, "Bonus Game not found");
      }
      query = { ...query, masterCasinoGameId: { [Op.in]: gameList.gameIds } };
      const gameWithFreespin = await db.MasterCasinoGame.findAndCountAll({
        where: query,
        order: [["createdAt", "DESC"]],
        limit: size,
        offset: (page - 1) * size,
      });

      if (!gameWithFreespin)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { gameWithFreespin, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
