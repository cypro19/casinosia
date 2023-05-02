import db from "../../db/models";
import { getOne } from "../common/crud";
import { ERRORS } from "../../utils/responseMessage";
import { ROLE } from "../../utils/constant";
import ServiceBase from "../../common/serviceBase";
import { liveUpdateWallet } from "../common/realTime";

const constraints = {
  data: {
    presence: { allowEmpty: false },
  },
};

export class ResponseService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { data } = this.filteredArgs;

    try {
      const getBalance = await getOne({
        model: db.Wallet,
        data: { ownerId: data.data.userId, ownerType: ROLE.USER },
        attributes: ["amount", "nonCashAmount"],
      });

      await liveUpdateWallet({
        userId: data.data.userId,
        userUuid: data.data.uniqueId,
        cash: getBalance.amount,
        nonCash: getBalance.nonCashAmount,
      });

      return { balance: getBalance.amount * 100 };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
