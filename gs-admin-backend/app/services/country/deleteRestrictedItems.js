import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { RESTRICTED_TYPE } from "../../utils/constant";
import { getOne, updateEntity } from "../helper/crud";
import { removeItems } from "./../../utils/common";

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
    presence: false,
  },
};

export class DeleteRestrictedItemsService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { itemIds, type, countryId } = this.filteredArgs;

    try {
      const checkCountryExists = await getOne({
        model: db.Country,
        data: { countryId },
      });

      if (!checkCountryExists)
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.NOT_FOUND);

      if (
        !checkCountryExists.restrictedProviders &&
        !checkCountryExists.restrictedGames
      ) {
        return this.addError(ERRORS.BAD_REQUEST, "No Restricted Item Found");
      }

      let dataItem = 0;
      if (type.toUpperCase() === RESTRICTED_TYPE.PROVIDERS) {
        dataItem = {
          restrictedProviders: removeItems(
            checkCountryExists.restrictedProviders,
            itemIds
          ),
        };
      } else if (type.toUpperCase() === RESTRICTED_TYPE.GAMES) {
        dataItem = {
          restrictedGames: removeItems(
            checkCountryExists.restrictedGames,
            itemIds
          ),
        };
      }
      const updatedCountry = await updateEntity({
        model: db.Country,
        values: { countryId },
        data: dataItem,
      });

      return {
        updatedCountry,
        message: SUCCESS_MSG.UPDATE_SUCCESS,
      };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
