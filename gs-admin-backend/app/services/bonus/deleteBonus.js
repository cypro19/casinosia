import db from "../../db/models";
import { ROLE } from "../../utils/constant";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { getOne, deleteEntity } from "../helper/crud";

const constraints = {
  user: {
    presence: { allowEmpty: false },
  },
  userType: {
    presence: { allowEmpty: false },
  },
  bonusId: {
    presence: { allowEmpty: false },
  },
};

export class DeleteBonusService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { user, userType, bonusId } = this.filteredArgs;

    try {
      let query = { bonusId };

      if (userType === ROLE.ADMIN) {
        query = { ...query, adminId: user.adminUserId };
      }

      const checkBonusExist = await getOne({
        model: db.Bonus,
        data: query,
      });

      if (!checkBonusExist) {
        return this.addError(
          ERRORS.BAD_DATA,
          "Bonus ID " + ERROR_MSG.NOT_FOUND
        );
      } else if (checkBonusExist.claimedCount > 0) {
        return this.addError(
          ERRORS.BAD_DATA,
          "Bonus is already claimed by user "
        );
      }

      await deleteEntity({
        model: db.Bonus,
        values: { bonusId: checkBonusExist.bonusId },
      });

      return { success: true, message: SUCCESS_MSG.DELETE_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
