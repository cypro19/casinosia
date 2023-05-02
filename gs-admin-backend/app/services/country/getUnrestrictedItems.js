import db from "../../db/models";
import { Op } from "sequelize";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { RESTRICTED_TYPE } from "../../utils/constant";
import { getOne } from "../helper/crud";
import { pageValidation } from "./../../utils/common";

const constraints = {
  countryId: {
    presence: { allowEmpty: false },
  },
  type: {
    inclusion: {
      within: [
        "providers",
        "games",
        "Providers",
        "Games",
        "PROVIDERS",
        "GAMES",
      ],
      message: "can be providers or games",
    },
    presence: { allowEmpty: false },
  },
  limit: {
    presence: false,
  },
  pageNo: {
    presence: false,
  },
};

export class GetUnrestrictedItemsService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { countryId, type, limit, pageNo } = this.filteredArgs;

    try {
      const { page, size } = pageValidation(pageNo, limit);

      const checkCountryExists = await getOne({
        model: db.Country,
        data: { countryId },
      });

      if (!checkCountryExists)
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.NOT_FOUND);

      let restrictedItems;
      if (type.toUpperCase() === RESTRICTED_TYPE.PROVIDERS) {
        const providers = await db.MasterCasinoProvider.findAndCountAll({
          order: [["createdAt", "DESC"]],
          limit: size,
          offset: (page - 1) * size,
          where: {
            masterCasinoProviderId: {
              [Op.notIn]: checkCountryExists?.restrictedProviders ?? [],
            },
          },
        });
        restrictedItems = { providers };
      } else if (type.toUpperCase() === RESTRICTED_TYPE.GAMES) {
        const games = await db.MasterCasinoGame.findAndCountAll({
          order: [["createdAt", "DESC"]],
          limit: size,
          offset: (page - 1) * size,
          where: {
            masterCasinoGameId: {
              [Op.notIn]: checkCountryExists?.restrictedGames ?? [],
            },
          },
          attributes: [
            "masterCasinoGameId",
            "name",
            "thumbnailUrl",
            "operatorStatus",
            "isActive",
            "masterCasinoProviderId",
          ],
        });
        restrictedItems = { games };
      }

      return { restrictedItems, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
