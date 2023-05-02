import db from "../../db/models";
import { Op, Sequelize } from "sequelize";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { pageValidation } from "../../utils/common";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  limit: {
    presence: false,
  },
  pageNo: {
    presence: false,
  },
  bonusType: {
    inclusion: {
      within: ["freespins", "deposit", "joining", "all", null, ""],
      message: "can be freespins, deposit",
    },
    presence: false,
  },
};

export class GetAllBonusService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { limit, pageNo, bonusType } = this.filteredArgs;

    try {
      let query = {
        isActive: true,
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn("date", Sequelize.col("valid_to")),
            ">=",
            new Date(Date.now())
          ),
        ],
      };

      const { page, size } = pageValidation(pageNo, limit);

      if (bonusType && bonusType !== "all") query = { ...query, bonusType };

      const bonus = await db.Bonus.findAndCountAll({
        where: query,
        order: [["createdAt", "DESC"]],
        limit: size,
        offset: (page - 1) * size,
        attributes: [
          "bonusId",
          "validFrom",
          "validTo",
          "promotionTitle",
          "bonusType",
          "quantity",
          "isSticky",
          "imageUrl",
          "currency",
          "validOnDays",
          "createdAt",
          "depositBonusPercent",
          "visibleInPromotions",
        ],
      });

      if (!bonus) return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { bonus, messages: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
