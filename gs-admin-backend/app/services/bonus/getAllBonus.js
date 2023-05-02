import db from "../../db/models";
import { Op } from "sequelize";
import { ROLE } from "../../utils/constant";
import { getAll, getOne } from "../helper/crud";
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
  userType: {
    presence: { allowEmpty: false },
  },
  adminId: {
    presence: false,
  },
  bonusType: {
    presence: false,
  },
  language: {
    presence: false,
  },
  search: {
    presence: false,
  },
  isActive: {
    inclusion: {
      within: ["true", "false", "", null],
      message: "can be true or false",
    },
    presence: false,
  },
  userId: {
    presence: false,
  },
};

export class GetBonusService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let {
      limit,
      pageNo,
      userType,
      adminId,
      bonusType,
      language,
      search,
      isActive,
      userId,
    } = this.filteredArgs;

    try {
      let query, page, size, bonus;
      if (pageNo && limit) {
        const values = pageValidation(pageNo, limit);
        page = values.page;
        size = values.size;
      }

      if (userType === ROLE.SUPERADMIN) {
        if (isActive && (isActive !== "" || isActive !== null))
          query = { ...query, isActive };
        if (bonusType) {
          if (typeof bonusType === "string") bonusType = JSON.parse(bonusType);
          query = { ...query, bonusType: { [Op.in]: bonusType } };
        }

        if (userId) {
          const userExist = await getOne({
            model: db.User,
            data: { userId },
            attributes: ["userId"],
          });

          if (!userExist)
            return this.addError(
              ERRORS.BAD_DATA,
              "User " + ERROR_MSG.NOT_EXISTS
            );

          query = { ...query };
        }

        if (search) {
          if (!language) language = "EN";
          query = {
            ...query,
            promotionTitle: { [`${language}`]: { [Op.iLike]: `%${search}%` } },
          };
        }

        if (page && size) {
          bonus = await db.Bonus.findAndCountAll({
            where: query,
            order: [["createdAt", "DESC"]],
            // include: [
            //   { model: db.AdminUser, as: 'adminUser', attributes: ['firstName', 'lastName', 'email'] }
            // ],
            limit: size,
            offset: (page - 1) * size,
          });
        } else {
          bonus = await getAll({
            model: db.Bonus,
            data: query,
            order: [["createdAt", "DESC"]],
            // include: [
            // { model: db.SuperAdminUser, as: 'adminUser', attributes: ['firstName', 'lastName', 'email'] }
            // ]
          });
        }

        if (!bonus) return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

        return { bonus, message: SUCCESS_MSG.GET_SUCCESS };
      }
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
