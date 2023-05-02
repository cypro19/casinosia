import { Op } from "sequelize";
import db from "../../db/models";
import { getAll } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { convertToCsv, getCsvFileName } from "../helper/email";
import { filterByDate, pageValidation } from "../../utils/common";
import { ACTION, CASINO_TRANSACTION_STATUS, ROLE } from "../../utils/constant";

const constraints = {
  pageNo: {
    presence: false,
  },
  limit: {
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
        "bet",
        "win",
        "rollback",
        "rollbackbeforebetwin",
        "freespins",
        "",
        null,
        "all",
      ],
      message: "Invalid",
    },
    presence: false,
  },
  email: {
    presence: false,
  },
  status: {
    inclusion: {
      within: ["pending", "completed", "failed", "rollback", "all", null, ""],
      message: "Invalid",
    },
    presence: false,
  },
  csvDownload: {
    presence: false,
  },
  adminId: {
    presence: false,
  },
  userType: {
    presence: { allowEmpty: false },
  },
  userId: {
    presence: false,
  },
};

export class GetCasinoTransactionsService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const {
      pageNo,
      limit,
      startDate,
      endDate,
      currencyCode,
      transactionType,
      email,
      status,
      csvDownload,
      adminId,
      userType,
      userId,
    } = this.filteredArgs;

    try {
      let query = {};
      let walletQuery = {};
      let userQuery = {};

      let { page, size } = pageValidation(pageNo, limit);

      if (csvDownload) {
        page = null;
        size = null;
      }

      if (startDate || endDate)
        query = filterByDate(query, startDate, endDate, "CasinoTransaction");
      if (status && status !== "all")
        query = {
          ...query,
          status: CASINO_TRANSACTION_STATUS[status.toUpperCase()],
        };
      if (email)
        userQuery = { ...userQuery, email: { [Op.iLike]: `%${email}%` } };
      if (userId) query = { ...query, userId };
      if (currencyCode) walletQuery = { ...walletQuery, currencyCode };
      if (transactionType && transactionType !== "all")
        query = {
          ...query,
          actionType: { [Op.eq]: ACTION[transactionType.toUpperCase()] },
        };
      const transactionDetail = await db.CasinoTransaction.findAndCountAll({
        where: query,
        attributes: { exclude: ["actionId"] },
        limit: size,
        offset: (page - 1) * size,
        order: [["createdAt", "DESC"]],
        include: [
          { model: db.Wallet, attributes: [], where: walletQuery },
          {
            model: db.User,
            attributes: ["email", "currencyCode"],
            where: userQuery,
          },
        ],
      });

      if (!transactionDetail)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      if (csvDownload && transactionDetail.count !== 0) {
        const fields = transactionDetail.rows[0]._options.attributes;
        fields.push("User.email");
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
