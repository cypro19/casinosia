import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { pageValidation } from "../../utils/common";

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
  status: {
    inclusion: {
      within: ["0", "5", "2", null, ""],
      message: "Invalid",
    },
    presence: false,
  },
};

export class GetWithdrawRequestsService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { limit, pageNo, status, id } = this.filteredArgs;

    try {
      const { page, size } = pageValidation(pageNo, limit);
      let query = { userId: id };

      if (status && (status !== "" || status !== null))
        query = { ...query, status };

      const withdrawRequest = await db.WithdrawRequest.findAndCountAll({
        order: [["createdAt", "DESC"]],
        where: query,
        limit: size,
        offset: (page - 1) * size,
        attributes: [
          "withdrawRequestId",
          "transactionId",
          "userId",
          "createdAt",
          "updatedAt",
          "status",
          "amount",
        ],
      });

      if (!withdrawRequest)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { withdrawRequest, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
