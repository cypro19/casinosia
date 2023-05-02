import db from "../../db/models";
import { pageValidation } from "../../utils/common";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  id: {
    presence: { allowEmpty: false },
  },
  limit: {
    presence: { allowEmpty: false },
  },
  pageNo: {
    presence: { allowEmpty: false },
  },
};

export class GetTransactionAffiliateService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { id, pageNo, limit } = this.filteredArgs;
    const { page, size } = pageValidation(pageNo, limit);
    try {
      const transactionAffiliate =
        await db.TransactionAffiliate.findAndCountAll({
          where: { affiliateId: id },
          order: [["createdAt", "DESC"]],
          limit: size,
          offset: (page - 1) * size,
        });

      if (!transactionAffiliate)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { transactionAffiliate, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
