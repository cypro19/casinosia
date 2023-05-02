import db from "../../db/models";
import { getOne } from "../helper/crud";
import { ROLE } from "../../utils/constant";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { getUserRegistration } from "../../utils/common";

const constraints = {
  userId: {
    presence: { allowEmpty: false },
  },
  userType: {
    presence: { allowEmpty: false },
  },
  user: {
    presence: false,
  },
  id: {
    presence: false,
  },
};

export class GetUserByIdService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { userId, userType, user } = this.filteredArgs;

    try {
      let query = { userId };
      if (userType === ROLE.SUPERADMIN) {
        const userDetail = await getOne({
          model: db.User,
          data: { userId },
        });

        if (!userDetail) {
          return this.addError(
            ERRORS.NOT_FOUND,
            "User detail " + ERROR_MSG.NOT_EXISTS
          );
        }
      }
      const getUser = await getOne({
        model: db.User,
        data: query,
        attributes: [
          "kycStatus",
          "documentLabels",
          "requestedDocuments",
          "tags",
          "parentId",
          "signInIp",
          "selfExclusion",
        ],
        include: [
          { model: db.Wallet, as: "userWallet" },
          { model: db.Limit, as: "userLimit" },
        ],
      });

      if (!getUser) {
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);
      }

      return { getUser, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
