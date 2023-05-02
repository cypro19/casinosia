import { Op } from "sequelize";
import db from "../../db/models";
import { getOne } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { pageValidation } from "../../utils/common";
import { RESTRICTED_TYPE } from "../../utils/constant";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  itemId: {
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

export class GetRestrictedCountriesService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let { itemId, type, limit, pageNo } = this.filteredArgs;

    const { page, size } = pageValidation(pageNo, limit);

    try {
      let checkRestrictedItemsExists, dataItem;
      itemId = parseInt(itemId);

      if (type.toUpperCase() === RESTRICTED_TYPE.PROVIDERS) {
        checkRestrictedItemsExists = await getOne({
          model: db.MasterCasinoProvider,
          data: { masterCasinoProviderId: itemId },
        });
        dataItem = { restrictedProviders: { [Op.contains]: itemId } };
      } else if (type.toUpperCase() === RESTRICTED_TYPE.GAMES) {
        checkRestrictedItemsExists = await getOne({
          model: db.MasterCasinoGame,
          data: { masterCasinoGameId: itemId },
        });
        dataItem = { restrictedGames: { [Op.contains]: itemId } };
      }

      if (!checkRestrictedItemsExists)
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.NOT_FOUND);

      const restrictedCountries = await db.Country.findAndCountAll({
        order: [["createdAt", "DESC"]],
        limit: size,
        offset: (page - 1) * size,
        where: dataItem,
        attributes: ["countryId", "code", "name"],
      });

      return { restrictedCountries, message: SUCCESS_MSG.UPDATE_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
