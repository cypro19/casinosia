import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import { pageValidation } from "../../utils/common";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  limit: {
    presence: { allowEmpty: false },
  },
  pageNo: {
    presence: { allowEmpty: false },
  },
  userId: {
    presence: { allowEmpty: false },
  },
  status: {
    inclusion: {
      within: [
        "PENDING",
        "ACTIVE",
        "CLAIMING",
        "CANCELLED",
        "FORFEITED",
        "EXPIRED",
        "IN-PROCESS",
        "ZEROED-OUT",
        "COMPLETED",
        "all",
        null,
        "",
      ],
      message:
        "can be pending, active, claiming, cancelled, forfeited, expired, completed, in-process or zeroed-out.",
    },
    presence: false,
  },
  bonusType: {
    inclusion: {
      within: ["joining", "freespins", "deposit", "all", null, ""],
      message: "can be match, joining, deposit or freespins",
    },
    presence: false,
  },
};

export class GetUserBonusService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { limit, pageNo, userId, status, bonusType } = this.filteredArgs;
    let query = { userId };

    try {
      const { page, size } = pageValidation(pageNo, limit);

      if (status && status !== "all") query = { ...query, status };
      if (bonusType && bonusType !== "all") query = { ...query, bonusType };

      const userBonus = await db.UserBonus.findAndCountAll({
        where: { ...query },
        order: [["createdAt", "DESC"]],
        include: {
          model: db.Bonus,
          as: "bonus",
          attributes: ["bonusId", "promotionTitle"],
        },
        limit: size,
        offset: (page - 1) * size,
      });

      if (!userBonus)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { userBonus, messages: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
