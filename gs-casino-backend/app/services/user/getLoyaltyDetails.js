import db from "../../db/models";
import { getOne } from "../helper/crud";
import { ERRORS } from "../../utils/errors";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { getLevelDetails } from "../../utils/common";

const constraints = {
  user: {
    presence: false,
  },
};
export class GetLoyaltyDetailsService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { user } = this.filteredArgs;

    try {
      const loyalty = JSON.parse(
        (
          await getOne({
            model: db.GlobalSetting,
            data: { key: "LOYALTY_LEVEL" },
          })
        ).value
      );

      const pointPerUnit = await getOne({
        model: db.Currency,
        data: { code: user.currencyCode },
        attributes: ["loyaltyPoint"],
        raw: true,
      });

      const loyaltyDetails = {
        currentPoint: user.loyaltyPoints,
      };

      loyaltyDetails.pointPerUnit = pointPerUnit.loyaltyPoint;

      const { startPoint, endPoint, maxLevel, level } = getLevelDetails({
        loyaltyLevels: loyalty,
        currentPoint: loyaltyDetails.currentPoint,
      });

      if (isNaN(level) || level === undefined || level === null) {
        loyaltyDetails.level = user.level;
      } else {
        loyaltyDetails.level = level;
        if (user.level !== level) await user.set({ level }).save();
      }

      loyaltyDetails.startPoint = startPoint;
      loyaltyDetails.endPoint = endPoint;
      loyaltyDetails.maxLevel = maxLevel;

      return { loyaltyDetails, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
