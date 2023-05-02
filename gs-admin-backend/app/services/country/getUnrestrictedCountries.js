import db from "../../db/models";
import { Op } from "sequelize";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { RESTRICTED_TYPE } from "../../utils/constant";
import { getOne } from "../helper/crud";
import { pageValidation } from "../../utils/common";

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

export class GetUnrestrictedCountriesService extends ServiceBase {
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
        dataItem = {
          [Op.or]: [
            { [Op.not]: { restrictedProviders: { [Op.contains]: itemId } } },
            { restrictedProviders: null },
          ],
        };
      } else if (type.toUpperCase() === RESTRICTED_TYPE.GAMES) {
        checkRestrictedItemsExists = await getOne({
          model: db.MasterCasinoGame,
          data: { masterCasinoGameId: itemId },
        });
        dataItem = {
          [Op.or]: [
            { [Op.not]: { restrictedGames: { [Op.contains]: itemId } } },
            { restrictedGames: null },
          ],
        };
      }

      if (!checkRestrictedItemsExists)
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.NOT_FOUND);

      const unrestrictedCountries = await db.Country.findAndCountAll({
        order: [["createdAt", "DESC"]],
        limit: size,
        offset: (page - 1) * size,
        where: dataItem,
        attributes: ["countryId", "code", "name"],
      });

      return { unrestrictedCountries, message: SUCCESS_MSG.UPDATE_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
