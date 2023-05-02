import db from "../../db/models";
import { getOne } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { pageValidation } from "../../utils/common";
import { RESTRICTED_TYPE } from "../../utils/constant";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

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

export class GetRestrictedItemsService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { countryId, type, limit, pageNo } = this.filteredArgs;

    try {
      let restrictedItems;
      const { page, size } = pageValidation(pageNo, limit);
      const checkCountryExist = await getOne({
        model: db.Country,
        data: { countryId },
      });

      if (!checkCountryExist)
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.NOT_FOUND);

      if (type.toUpperCase() === RESTRICTED_TYPE.PROVIDERS) {
        const providers = await db.MasterCasinoProvider.findAndCountAll({
          order: [["createdAt", "DESC"]],
          limit: size,
          offset: (page - 1) * size,
          where: {
            masterCasinoProviderId: checkCountryExist.restrictedProviders,
          },
        });
        restrictedItems = { providers };
      } else if (type.toUpperCase() === RESTRICTED_TYPE.GAMES) {
        const games = await db.MasterCasinoGame.findAndCountAll({
          order: [["createdAt", "DESC"]],
          limit: size,
          offset: (page - 1) * size,
          where: { masterCasinoGameId: checkCountryExist.restrictedGames },
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
