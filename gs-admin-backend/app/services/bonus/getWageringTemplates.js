import { Op } from "sequelize";
import db from "../../db/models";
import { ROLE } from "../../utils/constant";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { pageValidation, filterByName } from "../../utils/common";

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
  userType: {
    presence: { allowEmpty: false },
  },
  search: {
    presence: false,
  },
  adminId: {
    presence: false,
  },
  user: {
    presence: false,
  },
};

export class GetWageringTemplatesService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { id, userType, limit, pageNo, search, adminId, user } =
      this.filteredArgs;

    try {
      let query;
      const { page, size } = pageValidation(pageNo, limit);

      if (adminId)
        query = {
          [Op.or]: [
            { parentType: ROLE.ADMIN, parentId: adminId },
            { parentType: ROLE.SUPERADMIN },
          ],
        };
      if (userType === ROLE.ADMIN) {
        if (user.adminRoleId !== 1) {
          query = {
            ...query,
            [Op.or]: [
              { parentType: ROLE.ADMIN, parentId: user.parentId },
              { parentType: ROLE.SUPERADMIN },
            ],
          };
        } else {
          query = {
            ...query,
            [Op.or]: [
              { parentType: ROLE.ADMIN, parentId: id },
              { parentType: ROLE.SUPERADMIN },
            ],
          };
        }
      }

      if (search) query = filterByName(query, search);

      const wageringTemplates = await db.WageringTemplate.findAndCountAll({
        where: query,
        order: [["createdAt", "DESC"]],
        limit: size,
        offset: (page - 1) * size,
      });

      if (!wageringTemplates)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { wageringTemplates, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
