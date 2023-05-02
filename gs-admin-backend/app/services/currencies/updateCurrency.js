/* eslint-disable no-useless-escape */
import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { updateEntity, getOne } from "../helper/crud";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  currencyId: {
    type: "integer",
    presence: { allowEmpty: false },
  },
  name: {
    length: {
      minimum: 3,
      maximum: 50,
    },
    format: {
      pattern: "^[a-zA-Z ]*$",
      flags: "i",
      message: "can only contain a-z and A-Z",
    },
    presence: { allowEmpty: false },
  },
  exchangeRate: {
    length: {
      minimum: 1,
      maximum: 10,
    },
    format: {
      pattern: "^[+-]?([0-9]+.?[0-9]*|.[0-9]+)$",
      flags: "i",
      message: "'%{value}' is invalid'",
    },
    presence: { allowEmpty: false },
  },
  symbol: {
    presence: { allowEmpty: false },
  },
  type: {
    inclusion: {
      within: [0, 1],
      message: "invalid",
    },
    presence: { allowEmpty: false },
  },
  loyaltyPoint: {
    format: {
      pattern: "^[+-]?([0-9]+.?[0-9]*|.[0-9]+)$",
      flags: "i",
      message: "'%{value}' is invalid'",
    },
    presence: { allowEmpty: false },
  },
};

export class UpdateCurrencyService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { currencyId, name, exchangeRate, symbol, type, loyaltyPoint } =
      this.filteredArgs;

    const t = await db.sequelize.transaction();

    try {
      const checkCurrencyExist = await getOne({
        model: db.Currency,
        data: { currencyId },
      });

      if (!checkCurrencyExist)
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.NOT_FOUND);

      const updatedCurrency = await updateEntity({
        model: db.Currency,
        data: { name, exchangeRate, symbol, type, loyaltyPoint },
        values: { currencyId: checkCurrencyExist.currencyId },
        transaction: t,
      });

      await t.commit();

      return { updatedCurrency, message: SUCCESS_MSG.UPDATE_SUCCESS };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
