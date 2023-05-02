import { Op } from "sequelize";
import db from "../../db/models";
import { getOne } from "../helper/crud";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import {
  WAGER_STATUS,
  BONUS_TYPE,
  TRANSACTION_TYPE,
  BONUS_STATUS,
} from "../../utils/constant";

const constraints = {
  id: {
    presence: { allowEmpty: false },
  },
  type: {
    inclusion: {
      within: ["deposit", "withdraw"],
      message: "can be deposit or withdraw",
    },
    presence: { allowEmpty: false },
  },
};
export class InitPayService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { id, type } = this.filteredArgs;

    try {
      const userDetail = await getOne({
        model: db.User,
        data: { userId: id },
        attributes: ["userId", "email", "uniqueId", "kycStatus"],
        include: [
          {
            model: db.UserBonus,
            as: "bonus",
            where: {
              [Op.or]: {
                wageringStatus: WAGER_STATUS.STARTED,
                status: BONUS_STATUS.ACTIVE,
              },
            },
            attributes: ["userBonusId", "bonusType"],
            required: false,
          },
        ],
      });

      if (!userDetail)
        return this.addError(ERRORS.NOT_FOUND, "User " + ERROR_MSG.NOT_EXISTS);

      if (
        userDetail.bonus.length &&
        (type === TRANSACTION_TYPE.WITHDRAW ||
          (type === TRANSACTION_TYPE.DEPOSIT &&
            userDetail.bonus[0].bonusType !== BONUS_TYPE.FREESPINS))
      ) {
        return this.addError(
          ERRORS.BAD_DATA,
          "You already have an ACTIVE bonus, If you want to continue FORFEIT it first."
        );
      }

      return { userId: id };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
