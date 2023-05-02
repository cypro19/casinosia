import { Op } from "sequelize";
import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { pageValidation } from "../../utils/common";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { BONUS_STATUS, BONUS_TYPE } from "../../utils/constant";

const constraints = {
  limit: {
    presence: false,
  },
  pageNo: {
    presence: false,
  },
  id: {
    presence: { allowEmpty: false },
  },
  status: {
    presence: false,
  },
  inDeposit: {
    inclusion: {
      within: ["true", "", null],
    },
    presence: false,
  },
};

export class GetUserBonusService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let { limit, pageNo, id, status, inDeposit } = this.filteredArgs;
    let query = { userId: id };

    try {
      const { page, size } = pageValidation(pageNo, limit);

      if (status) {
        if (typeof status === "string") status = JSON.parse(status);
        query = { ...query, status: { [Op.in]: status } };
      }

      if (inDeposit) {
        query = {
          ...query,
          [Op.or]: {
            [Op.and]: {
              bonusType: { [Op.notIn]: [BONUS_TYPE.FREESPINS] },
              bonusAmount: 0,
            },
            status: { [Op.in]: [BONUS_STATUS.ACTIVE, BONUS_STATUS.IN_PROCESS] },
          },
        };
      }

      const userBonus = await db.UserBonus.findAndCountAll({
        where: { ...query },
        include: {
          model: db.Bonus,
          as: "bonus",
          attributes: ["promotionTitle", "currency"],
        },
        order: [["createdAt", "DESC"]],
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
