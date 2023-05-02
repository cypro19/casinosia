import db from "../../db/models";
import { getOne } from "../helper/crud";
import { ROLE } from "../../utils/constant";
import ServiceBase from "../../common/serviceBase";

const constraints = {
  currencyCode: {
    presence: { allowEmpty: false },
  },
  ownerId: {
    presence: { allowEmpty: false },
  },
  ownerType: {
    presence: { allowEmpty: false },
  },
  nonCashAmount: {
    presence: { allowEmpty: false },
  },
  winningAmount: {
    presence: { allowEmpty: false },
  },
  transaction: {
    presence: { allowEmpty: false },
  },
};

export class CreateWalletService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const {
      currencyCode,
      ownerId,
      nonCashAmount,
      winningAmount,
      ownerType,
      transaction,
    } = this.filteredArgs;

    try {
      const checkWalletExists = await getOne({
        model: db.Wallet,
        data: { ownerId, ownerType, currencyCode },
      });

      if (checkWalletExists) return checkWalletExists;

      if (ownerType !== ROLE.SUPERADMIN) return null;

      return await db.Wallet.create(
        {
          amount: 0,
          currencyCode,
          ownerId,
          nonCashAmount,
          winningAmount,
          ownerType,
        },
        { transaction }
      );
    } catch {
      return null;
    }
  }
}
