import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import {
  filterByActioneeNameEmail,
  filterByDate,
  pageValidation,
} from "../../utils/common";

const constraints = {
  limit: {
    presence: false,
  },
  pageNo: {
    presence: false,
  },
  id: {
    presence: { allowEmpty: false },
  },
  startDate: {
    presence: false,
  },
  endDate: {
    presence: false,
  },
  transactionType: {
    inclusion: {
      within: [
        "bonus",
        "deposit",
        "withdraw",
        "",
        null,
        "all",
        "addMoney",
        "removeMoney",
        "addMoneyInternal",
        "removeMoneyInternal",
      ],
      message: "Invalid",
    },
    presence: false,
  },
  search: {
    presence: false,
  },
};

export class GetUserTransactionsService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { limit, pageNo, id, startDate, endDate, transactionType, search } =
      this.filteredArgs;

    try {
      let query = { targetId: id };
      const { page, size } = pageValidation(pageNo, limit);

      if (search) query = filterByActioneeNameEmail(query, search);
      if (startDate || endDate) query = filterByDate(query, startDate, endDate);
      if (transactionType && transactionType !== "all")
        query = { ...query, transactionType };

      const transactions = await db.TransactionBanking.findAndCountAll({
        order: [["createdAt", "DESC"]],
        where: query,
        limit: size,
        offset: (page - 1) * size,
      });

      if (!transactions)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { transactions, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
