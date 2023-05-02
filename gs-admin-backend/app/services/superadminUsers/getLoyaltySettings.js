import db from "../../db/models";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { ROLE } from "../../utils/constant";
import { setLoyaltySequence } from "../../utils/common";

const constraints = {
  userType: {
    presence: { allowNull: false },
  },
};

export class GetLoyaltyLevelService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { userType } = this.filteredArgs;

    try {
      let loyaltyLevel;

      if (userType === ROLE.SUPERADMIN) {
        loyaltyLevel = JSON.parse(
          (
            await db.GlobalSetting.findOne({
              attributes: ["key", "value"],
              where: { key: "LOYALTY_LEVEL" },
              raw: true,
            })
          ).value
        );
      }
      if (!loyaltyLevel)
        return this.addError(
          ERRORS.BAD_DATA,
          ERROR_MSG.LOYALTY_LEVEL_NOT_FOUND
        );

      return { loyaltyLevel: setLoyaltySequence(loyaltyLevel) };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
