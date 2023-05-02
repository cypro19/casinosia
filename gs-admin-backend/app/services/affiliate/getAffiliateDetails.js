import db from "../../db/models";
import { getOne } from "../helper/crud";
import { ROLE } from "../../utils/constant";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  affiliateId: {
    format: {
      pattern: "^[0-9]+$",
      flags: "i",
      message: "can only contain integer value",
    },
    presence: false,
  },
  userType: {
    presence: false,
  },
  user: {
    presence: false,
  },
  id: {
    presence: false,
  },
};

export class GetAffiliateService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { affiliateId, user, userType, id } = this.filteredArgs;

    try {
      let query = { affiliateId };

      if (userType === ROLE.ADMIN && user) {
        query = { ...query };
      } else if (userType === ROLE.AFFILIATE) {
        query = { affiliateId: id };
      }

      const affiliate = await getOne({
        model: db.Affiliate,
        data: query,
        attributes: { exclude: ["password"] },
      });

      if (!affiliate)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { affiliate, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
