/* eslint-disable no-useless-escape */
import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { getAll } from "../helper/crud";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  currencyFields: {
    presence: { allowEmpty: false },
  },
  currentCurrencyCode: {
    presence: { allowEmpty: false },
  },
};

export class ConvertAmountService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let { currencyFields, currentCurrencyCode } = this.filteredArgs;

    try {
      const currencies = await getAll({
        model: db.Currency,
        attributes: ["code", "exchangeRate"],
        raw: true,
      });

      if (!currencies)
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.NOT_FOUND);

      const currenciesAmount = {};

      if (typeof currencyFields === "string")
        currencyFields = JSON.parse(currencyFields);

      const currentCurrencyDetails = currencies.find(
        (item) => item.code === currentCurrencyCode
      );

      for (const currency of currencies) {
        if (currency.code === currentCurrencyCode) {
          currenciesAmount[currency.code] = { ...currencyFields };
        } else {
          const temp = {};
          for (const key in currencyFields) {
            temp[key] =
              Math.round(
                currencyFields[key] *
                  (currentCurrencyDetails.exchangeRate /
                    currency.exchangeRate) *
                  100
              ) / 100;
          }
          currenciesAmount[currency.code] = temp;
        }
      }

      return { currenciesAmount, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
