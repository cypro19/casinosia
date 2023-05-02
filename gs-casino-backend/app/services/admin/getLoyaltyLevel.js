import db from "../../db/models";
import { getOne } from "../helper/crud";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { setLoyaltySequence } from "../../utils/common";

export class GetLoyaltyLevelService extends ServiceBase {
  async run() {
    try {
      const loyaltyLevel = JSON.parse(
        (
          await getOne({
            model: db.GlobalSetting,
            data: { key: "LOYALTY_LEVEL" },
          })
        ).value
      );

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
