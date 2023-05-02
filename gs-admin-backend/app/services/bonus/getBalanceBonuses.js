import { Op } from "sequelize";
import db from "../../db/models";
import { getAll } from "../helper/crud";
import { BONUS_TYPE } from "../../utils/constant";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {};

export class GetBalanceBonusesService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const {} = this.filteredArgs;

    try {
      const bonusDetails = await getAll({
        model: db.Bonus,
        data: { bonusType: { [Op.ne]: BONUS_TYPE.JOINING }, isActive: true },
        attributes: ["bonusId", "promotionTitle", "bonusType"],
      });

      if (!bonusDetails)
        return this.addError(
          ERRORS.NOT_FOUND,
          "Bonus details " + ERROR_MSG.NOT_FOUND
        );

      return { bonusDetails, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
