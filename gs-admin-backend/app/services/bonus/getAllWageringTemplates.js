import { Op } from "sequelize";
import db from "../../db/models";
import { getAll } from "../helper/crud";
import { ROLE } from "../../utils/constant";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  id: {
    presence: { allowEmpty: false },
  },
  userType: {
    presence: { allowEmpty: false },
  },
  adminId: {
    presence: false,
  },
  user: {
    presence: false,
  },
};

export class GetAllWageringTemplatesService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { id, userType, adminId, user } = this.filteredArgs;

    try {
      let query;

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
            [Op.or]: [
              { parentType: ROLE.ADMIN, parentId: user.parentId },
              { parentType: ROLE.SUPERADMIN },
            ],
          };
        } else {
          query = {
            [Op.or]: [
              { parentType: ROLE.ADMIN, parentId: id },
              { parentType: ROLE.SUPERADMIN },
            ],
          };
        }
      }

      const getTemplates = await getAll({
        model: db.WageringTemplate,
        data: query,
      });

      if (!getTemplates)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { getTemplates, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
