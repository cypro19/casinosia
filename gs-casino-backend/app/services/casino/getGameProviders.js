import { Op } from "sequelize";
import db from "../../db/models";
import { getLocation } from "../../utils/common";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  ipAddress: {
    presence: { allowEmpty: false },
  },
};

export class GetGameProvidersService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { ipAddress } = this.filteredArgs;

    try {
      const restricted = await getLocation(ipAddress);

      let games, providers;

      if (!restricted)
        return this.addError(
          ERRORS.NOT_FOUND,
          "Country " + ERROR_MSG.NOT_FOUND
        );

      if (restricted.restrictedGames) {
        games = {
          masterCasinoGameId: { [Op.notIn]: restricted.restrictedGames },
        };
      }

      if (restricted.restrictedProviders) {
        providers = {
          masterCasinoProviderId: {
            [Op.notIn]: restricted.restrictedProviders,
          },
        };
      }

      const casinoCategories = await db.MasterCasinoGame.findAndCountAll({
        attributes: [],
        where: {
          [Op.and]: [{ operatorStatus: true }, { isActive: true }, games],
        },
        include: {
          model: db.MasterCasinoProvider,
          attributes: ["name", "thumbnailUrl"],
          where: { [Op.and]: [{ isActive: true }, providers] },
          required: true,
        },
        required: true,
        group: [
          db.sequelize.col("MasterCasinoProvider.name"),
          db.sequelize.col("MasterCasinoProvider.thumbnail_url"),
          db.sequelize.col("MasterCasinoProvider.master_casino_provider_id"),
        ],
      });

      if (!casinoCategories)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      const { count } = casinoCategories;

      return { providers: count, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
