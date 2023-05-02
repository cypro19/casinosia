import { Op } from "sequelize";

import db from "../../db/models";
import { ACTION } from "../../utils/constant";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { pageValidation, filterByDate, filterByName } from "../../utils/common";

const constraints = {
  id: {
    presence: { allowEmpty: false },
  },
  limit: {
    presence: false,
  },
  pageNo: {
    presence: false,
  },
  startDate: {
    presence: false,
  },
  endDate: {
    presence: false,
  },
  actionType: {
    inclusion: {
      within: [
        "bet",
        "win",
        "rollback",
        "rollbackbeforebetwin",
        "freespins",
        "",
        null,
        "all",
        "betInternal",
        "winInternal",
      ],
      message: "Invalid",
    },
    presence: false,
  },
  search: {
    presence: false,
  },
};

export class GetCasinoTransactionService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { limit, pageNo, id, startDate, endDate, actionType, search } =
      this.filteredArgs;

    try {
      let query = { userId: id };
      const { page, size } = pageValidation(pageNo, limit);

      if (search) query = filterByName(query, search);
      if (startDate || endDate) query = filterByDate(query, startDate, endDate);
      if (actionType && actionType !== "all")
        query = {
          ...query,
          actionType: { [Op.eq]: ACTION[actionType.toUpperCase()] },
        };

      const casinoTransaction = await db.CasinoTransaction.findAndCountAll({
        where: query,
        order: [["createdAt", "DESC"]],
        limit: size,
        offset: (page - 1) * size,
        attributes: [
          "gameIdentifier",
          "actionType",
          "amount",
          "updatedAt",
          "currencyCode",
          "beforeBalance",
          "afterBalance",
          "amountType",
          "nonCashAmount",
        ],
      });

      if (!casinoTransaction)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { casinoTransaction, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
