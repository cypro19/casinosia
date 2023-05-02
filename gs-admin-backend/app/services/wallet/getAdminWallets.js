import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  userType: {
    presence: { allowEmpty: false },
  },
  id: {
    presence: false,
  },
};

export class GetWalletService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { id, userType } = this.filteredArgs;
    try {
      const wallet = await db.Wallet.findAndCountAll({
        order: [["createdAt", "DESC"]],
        where: { ownerId: id, ownerType: userType },
      });

      if (!wallet)
        return this.addError(
          ERRORS.NOT_FOUND,
          "Wallet " + ERROR_MSG.NOT_EXISTS
        );

      return { wallet, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
