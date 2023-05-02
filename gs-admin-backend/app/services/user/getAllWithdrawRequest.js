import db from "../../db/models";
import { Op } from "sequelize";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import {
  pageValidation,
  filterByEmailName,
  filterByDate,
} from "../../utils/common";
import { ROLE } from "../../utils/constant";
import { getAll } from "../helper/crud";

const constraints = {
  limit: {
    presence: false,
  },
  pageNo: {
    presence: false,
  },
  userType: {
    presence: { allowEmpty: false },
  },
  search: {
    presence: false,
  },
  status: {
    inclusion: {
      within: ["0", "5", "2", null, ""],
      message: "Invalid",
    },
    presence: false,
  },
  startDate: {
    presence: false,
  },
  endDate: {
    presence: false,
  },
  paymentProvider: {
    presence: false,
  },
  adminId: {
    presence: false,
  },
};

export class GetWithdrawRequestService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let query;
    const {
      limit,
      pageNo,
      status,
      search,
      startDate,
      endDate,
      userType,
      paymentProvider,
      adminId,
    } = this.filteredArgs;
    try {
      const { page, size } = pageValidation(pageNo, limit);

      if (startDate || endDate)
        query = filterByDate(query, startDate, endDate, "WithdrawRequest");
      if (search) query = filterByEmailName(query, search);
      if (status && (status !== "" || status !== null))
        query = { ...query, status };

      if (paymentProvider) {
        const name = paymentProvider
          .replace(/\\/g, "\\\\")
          .replace(/%/g, "\\%")
          .replace(/_/g, "\\_");
        query = { ...query, paymentProvider: { [Op.iLike]: `%${name}%` } };
      }

      const withdrawRequest = await db.WithdrawRequest.findAndCountAll({
        order: [["createdAt", "DESC"]],
        where: query,
        attributes: {
          exclude: ["accountNumber", "ifscCode", "phoneNumber", "actionableId"],
        },
        limit: size,
        offset: (page - 1) * size,
      });

      if (!withdrawRequest)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { withdrawRequest, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
