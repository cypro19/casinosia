/* eslint-disable no-useless-escape */
import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { createNewEntity, getOne } from "../helper/crud";

const constraints = {
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
  code: {
    length: {
      is: 3,
    },
    format: {
      pattern: "^[A-Z]*$",
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
    presence: false,
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

export class CreateCurrencyService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { name, code, exchangeRate, symbol, type, loyaltyPoint } =
      this.filteredArgs;

    const t = await db.sequelize.transaction();

    try {
      const checkCurrency = await getOne({
        model: db.Currency,
        data: { code },
      });

      if (checkCurrency && checkCurrency.code === code) {
        return this.addError(ERRORS.BAD_DATA, "Currency " + ERROR_MSG.EXISTS);
      }

      const createCurrency = await createNewEntity({
        model: db.Currency,
        data: {
          name,
          type,
          code: code.toUpperCase(),
          exchangeRate,
          symbol,
          loyaltyPoint,
        },
        transaction: t,
      });

      await t.commit();
      return { createCurrency, message: SUCCESS_MSG.CREATE_SUCCESS };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
