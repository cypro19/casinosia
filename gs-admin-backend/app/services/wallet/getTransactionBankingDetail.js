import { Op } from "sequelize";
import db from "../../db/models";
import { getAll } from "../helper/crud";
import { ROLE, TRANSACTION_STATUS } from "../../utils/constant";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { convertToCsv, getCsvFileName } from "../helper/email";
import { filterByDate, pageValidation } from "../../utils/common";

const constraints = {
  userType: {
    presence: { allowEmpty: false },
  },
  pageNo: {
    presence: false,
  },
  orderBy: {
    presence: false,
  },
  limit: {
    presence: false,
  },
  sort: {
    presence: false,
  },
  startDate: {
    presence: false,
  },
  endDate: {
    presence: false,
  },
  currencyCode: {
    presence: false,
  },
  transactionType: {
    inclusion: {
      within: [
        "deposit",
        "withdraw",
        "bonus",
        "bonusToCash",
        "bonusForfeit",
        "bonusExpired",
        "bonusZeroedOut",
        "",
        null,
        "all",
        "addMoney",
        "removeMoney",
      ],
      message: "Invalid",
    },
    presence: false,
  },
  actioneeType: {
    inclusion: {
      within: ["user", "admin", "", null],
    },
    presence: false,
  },
  paymentProvider: {
    presence: false,
  },
  adminId: {
    presence: false,
  },
  userId: {
    presence: false,
  },
  csvDownload: {
    presence: false,
  },
  status: {
    inclusion: {
      within: ["0", "1", "2", null, ""],
      message: "Invalid",
    },
    presence: false,
  },
};

export class GetTransactionBankingDetail extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let {
      userType,
      pageNo,
      limit,
      startDate,
      endDate,
      currencyCode,
      transactionType,
      actioneeType,
      paymentProvider,
      orderBy,
      sort,
      adminId,
      userId,
      csvDownload,
      status,
    } = this.filteredArgs;

    try {
      let query;
      let { page, size } = pageValidation(pageNo, limit);

      if (csvDownload) {
        page = null;
        size = null;
      }

      if (actioneeType) query = { ...query, actioneeType };
      if (startDate || endDate)
        query = filterByDate(query, startDate, endDate, "TransactionBanking");
      if (currencyCode) query = { ...query, currencyCode };
      if (transactionType && transactionType !== "all")
        query = { ...query, transactionType: { [Op.eq]: transactionType } };
      if (!sort || sort === "") sort = "DESC";
      if (userId) query = { ...query, targetId: userId };
      if (!orderBy || orderBy === "") orderBy = "transactionBankingId";
      if (paymentProvider) {
        const name = paymentProvider
          .replace(/\\/g, "\\\\")
          .replace(/%/g, "\\%")
          .replace(/_/g, "\\_");
        query = { ...query, paymentProvider: { [Op.iLike]: `%${name}%` } };
      }
      if (status && (status !== "" || status !== null)) {
        if (parseInt(status) === TRANSACTION_STATUS.SUCCESS) {
          query = {
            ...query,
            status: {
              [Op.or]: [
                TRANSACTION_STATUS.SUCCESS,
                TRANSACTION_STATUS.APPROVED,
              ],
            },
          };
        } else {
          query = { ...query, status };
        }
      }

      const transactionDetail = await db.TransactionBanking.findAndCountAll({
        where: query,
        limit: size,
        offset: (page - 1) * size,
        order: [[orderBy, sort]],
      });

      if (!transactionDetail)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      if (csvDownload && transactionDetail.count !== 0) {
        const fields = transactionDetail.rows[0]._options.attributes;
        const csvData = convertToCsv({
          fields,
          data: transactionDetail.rows,
        });

        return { csv: true, csvData, fileName: getCsvFileName() };
      }

      return { transactionDetail, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
