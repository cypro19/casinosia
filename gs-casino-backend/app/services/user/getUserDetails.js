import db from "../../db/models";
import { getOne } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { getGlobalRegistration, getUserRegistration } from "../../utils/common";

const constraints = {
  id: {
    presence: false,
  },
};
export class GetUserDetailsService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { id } = this.filteredArgs;

    try {
      let dataArray = getUserRegistration(await getGlobalRegistration());
      dataArray = [
        ...dataArray,
        "profileImage",
        "kycStatus",
        "level",
        "loyaltyPoints",
        "tags",
        "locale",
      ];

      const getUser = await getOne({
        model: db.User,
        data: { userId: id },
        attributes: dataArray,
        include: [
          { model: db.Wallet, as: "userWallet" },
          { model: db.Limit, as: "userLimit" },
        ],
      });

      if (!getUser) return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { getUser, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
