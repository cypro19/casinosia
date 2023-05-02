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
    presence: false,
  },
};

export class UpdateRestrictedItemsService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { itemId, type, countryIds } = this.filteredArgs;

    const t = await db.sequelize.transaction();

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

      let updatedItems = 0;
      for (const countryId of countryIds) {
        const checkCountryExists = await getOne({
          model: db.Country,
          data: { countryId },
        });

        if (!checkCountryExists)
          return this.addError(ERRORS.BAD_DATA, ERROR_MSG.NOT_FOUND);

        let dataItem = 0;
        if (type.toUpperCase() === RESTRICTED_TYPE.PROVIDERS) {
          if (checkCountryExists.restrictedProviders) {
            checkCountryExists.restrictedProviders.push(itemId);
          } else {
            checkCountryExists.restrictedProviders = [itemId];
          }
          dataItem = {
            restrictedProviders: [
              ...new Set(checkCountryExists.restrictedProviders),
            ],
          };
        } else if (type.toUpperCase() === RESTRICTED_TYPE.GAMES) {
          if (checkCountryExists.restrictedGames) {
            checkCountryExists.restrictedGames.push(itemId);
          } else {
            checkCountryExists.restrictedGames = [itemId];
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

        updatedItems += parseInt(updatedCountry);
      }

      await t.commit();
      return {
        updatedItems,
        message: SUCCESS_MSG.UPDATE_SUCCESS,
      };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
