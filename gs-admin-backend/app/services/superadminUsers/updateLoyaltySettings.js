import { Op } from "sequelize";
import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { getAll, updateEntity } from "../helper/crud";
import { ERRORS } from "../../utils/errors";
import { BONUS_TYPE, ROLE } from "../../utils/constant";

const constraints = {
  loyaltyLevel: {
    presence: { allowEmpty: false },
  },
  userType: {
    presence: { allowEmpty: false },
  },
};

export class UpdateLoyaltyLevelService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { loyaltyLevel, userType } = this.filteredArgs;

    try {
      let updateLoyaltyLevel,
        multiplier,
        percentage,
        newArray,
        lastObject,
        difference;

      loyaltyLevel[0].startPoint = 0;

      if (userType === ROLE.SUPERADMIN) {
        updateLoyaltyLevel = await updateEntity({
          model: db.GlobalSetting,
          data: { value: JSON.stringify(loyaltyLevel) },
          values: { key: "LOYALTY_LEVEL" },
        });
      }

      return { updateLoyaltyLevel, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
