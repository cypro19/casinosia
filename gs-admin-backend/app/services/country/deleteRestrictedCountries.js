import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { RESTRICTED_TYPE } from "../../utils/constant";
import { getOne, updateEntity } from "../helper/crud";

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
  countryIds: {
    presence: { allowEmpty: false },
  },
};

export class DeleteRestrictedCountriesService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { itemId, type, countryIds } = this.filteredArgs;

    try {
      let checkRestrictedItemsExists;
      if (type.toUpperCase() === RESTRICTED_TYPE.PROVIDERS) {
        checkRestrictedItemsExists = await getOne({
          model: db.MasterCasinoProvider,
          data: { masterCasinoProviderId: itemId },
        });
      } else if (type.toUpperCase() === RESTRICTED_TYPE.GAMES) {
        checkRestrictedItemsExists = await getOne({
          model: db.MasterCasinoGame,
          data: { masterCasinoGameId: itemId },
        });
      }

      if (!checkRestrictedItemsExists)
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.NOT_FOUND);

      let deletedCountries = 0;
      for (const countryId of countryIds) {
        const checkCountryExists = await getOne({
          model: db.Country,
          data: { countryId },
        });
        if (!checkCountryExists)
          return this.addError(ERRORS.BAD_DATA, ERROR_MSG.NOT_FOUND);

        let dataItem, itemIndex;
        if (
          checkCountryExists.restrictedGames ||
          checkCountryExists.restrictedProviders
        ) {
          if (type.toUpperCase() === RESTRICTED_TYPE.PROVIDERS) {
            itemIndex = checkCountryExists.restrictedProviders.indexOf(itemId);
            if (itemIndex > -1) {
              checkCountryExists.restrictedProviders.splice(itemIndex, 1);
              dataItem = {
                restrictedProviders: checkCountryExists.restrictedProviders,
              };
            } else continue;
          } else if (type.toUpperCase() === RESTRICTED_TYPE.GAMES) {
            itemIndex = checkCountryExists.restrictedGames.indexOf(itemId);
            if (itemIndex > -1) {
              checkCountryExists.restrictedGames.splice(itemIndex, 1);
              dataItem = {
                restrictedGames: checkCountryExists.restrictedGames,
              };
            } else continue;
          }
        } else {
          continue;
        }

        const updatedCountry = await updateEntity({
          model: db.Country,
          values: { countryId },
          data: dataItem,
        });

        deletedCountries += parseInt(updatedCountry);
      }

      return {
        deletedCountries,
        message: SUCCESS_MSG.UPDATE_SUCCESS,
      };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
