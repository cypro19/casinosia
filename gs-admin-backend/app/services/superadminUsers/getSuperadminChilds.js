import db from "../../db/models";
import { ROLE_ID } from "../../utils/constant";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  superAdminId: {
    presence: false,
  },
  superRoleId: {
    presence: { allowEmpty: false },
  },
};

export class GetSuperadminChildren extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { superAdminId, superRoleId } = this.filteredArgs;
    let query;

    try {
      if (parseInt(superRoleId) === ROLE_ID.SUPERADMIN) {
        const getSuperadmins = await db.SuperAdminUser.findAndCountAll({
          where: { superRoleId: ROLE_ID.SUPERADMIN },
          attributes: ["superAdminUserId"],
        });

        const superadmin = [];
        getSuperadmins.rows.map((superadmins) => {
          superadmin.push(superadmins.superAdminUserId);
        });

        query = { parentId: superadmin };
      } else query = { parentId: superAdminId };

      const adminDetails = await db.SuperAdminUser.findAndCountAll({
        where: query,
        order: [["superAdminUserId", "ASC"]],
        attributes: [
          "superAdminUserId",
          "firstName",
          "lastName",
          "email",
          "superRoleId",
          "parentId",
        ],
      });

      const details = [];
      if (!adminDetails)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);
      if (adminDetails.count) {
        await Promise.all(
          adminDetails.rows.map(async (superadmin) => {
            const childCount = await db.SuperAdminUser.count({
              where: { parentId: superadmin.superAdminUserId },
            });
            details.push({ ...superadmin.dataValues, childCount });
          })
        );
      }

      return { adminDetails: details, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
