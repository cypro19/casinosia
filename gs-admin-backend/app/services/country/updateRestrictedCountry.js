/* eslint-disable no-useless-escape */
import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { updateEntity, getOne } from "../helper/crud";
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
  itemIds: {
    presence: { allowEmpty: false },
  },
};

export class UpdateRestrictedCountryService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { countryId, type, itemIds } = this.filteredArgs;

    const t = await db.sequelize.transaction();

    try {
      const checkCountryExists = await getOne({
        model: db.Country,
        data: { countryId },
      });

      if (!checkCountryExists)
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.NOT_FOUND);

      let dataItem;
      if (type.toUpperCase() === RESTRICTED_TYPE.PROVIDERS) {
        if (checkCountryExists.restrictedProviders) {
          checkCountryExists.restrictedProviders.push(...itemIds);
        } else {
          checkCountryExists.restrictedProviders = itemIds;
        }
        dataItem = {
          restrictedProviders: [
            ...new Set(checkCountryExists.restrictedProviders),
          ],
        };
      } else if (type.toUpperCase() === RESTRICTED_TYPE.GAMES) {
        if (checkCountryExists.restrictedGames) {
          checkCountryExists.restrictedGames.push(...itemIds);
        } else {
          checkCountryExists.restrictedGames = itemIds;
        }
        dataItem = {
          restrictedGames: [...new Set(checkCountryExists.restrictedGames)],
        };
      }
      const updatedCountry = await updateEntity({
        model: db.Country,
        values: { countryId },
        data: dataItem,
        transaction: t,
      });

      await t.commit();
      return {
        updatedCountry,
        message: SUCCESS_MSG.UPDATE_SUCCESS,
      };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
