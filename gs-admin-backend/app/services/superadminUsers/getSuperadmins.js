import db from "../../db/models";
import { Op, Sequelize } from "sequelize";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { filterByNameEmailGroup, pageValidation } from "../../utils/common";

const constraints = {
  id: {
    presence: { allowEmpty: false },
  },
  orderBy: {
    presence: { allowEmpty: false },
  },
  superAdminId: {
    presence: false,
  },
  pageNo: {
    presence: false,
  },
  limit: {
    presence: false,
  },
  sort: {
    presence: { allowEmpty: false },
  },
  search: {
    presence: false,
  },
  superRoleId: {
    presence: false,
  },
  user: {
    presence: { allowEmpty: false },
  },
  group: {
    presence: false,
  },
};

export class GetSuperadminUsers extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const {
      id,
      superAdminId,
      orderBy,
      pageNo,
      limit,
      sort,
      search,
      superRoleId,
      user,
    } = this.filteredArgs;
    let query;
    let parentId = id;

    try {
      const { page, size } = pageValidation(pageNo, limit);
      if (user.superRoleId !== 1)
        query = { [Op.or]: [{ parentId }, { superAdminUserId: id }] };

      if (user.superRoleId !== 1) {
        if (search) {
          query = {
            ...query,
            [Op.and]: [
              {
                [Op.or]: [
                  Sequelize.where(
                    Sequelize.fn(
                      "concat",
                      Sequelize.col("first_name"),
                      " ",
                      Sequelize.col("last_name")
                    ),
                    {
                      [Op.iLike]: `%${search}%`,
                    }
                  ),
                  { email: { [Op.iLike]: `%${search}%` } },
                ],
                [Op.or]: [{ parentId }, { superAdminUserId: id }],
              },
            ],
          };
        } else {
          query = { [Op.or]: [{ parentId }, { superAdminUserId: id }] };
        }
      }
      if (search) query = filterByNameEmailGroup(query, search);
      if (superRoleId) query = { ...query, superRoleId: superRoleId };
      if (superAdminId) parentId = superAdminId;

      let adminDetails;
      if (pageNo && limit) {
        adminDetails = await db.SuperAdminUser.findAndCountAll({
          where: query,
          limit: size,
          offset: (page - 1) * size,
          order: [[orderBy, sort]],
          attributes: { exclude: ["password"] },
        });
      } else {
        adminDetails = await db.SuperAdminUser.findAndCountAll({
          where: query,
          order: [[orderBy, sort]],
          attributes: [
            "superAdminUserId",
            "firstName",
            "lastName",
            "email",
            "superRoleId",
            "parentId",
            "group",
          ],
        });
      }
      if (!adminDetails)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { adminDetails, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
