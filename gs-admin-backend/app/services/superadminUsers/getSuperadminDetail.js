import db from "../../db/models";
import { getOne } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { Op } from "sequelize";
import { decodeCredential } from "../../utils/common";

const constraints = {
  id: {
    presence: { allowEmpty: false },
  },
  user: {
    presence: { allowEmpty: false },
  },
  superAdminUserId: { presence: false },
};

export class GetSuperadminDetail extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { superAdminUserId, id, user } = this.filteredArgs;
    let query;

    try {
      if (superAdminUserId) {
        if (user.superRoleId !== 1) {
          query = {
            ...query,
            [Op.or]: [{ parentId: id }, { superAdminUserId: id }],
          };
        }
        query = { ...query, superAdminUserId };
      } else query = { superAdminUserId: id };

      const adminDetails = await getOne({
        model: db.SuperAdminUser,
        include: [
          { model: db.SuperadminRole },
          { model: db.SuperAdminUserPermission, as: "userPermission" },
        ],
        data: query,
      });

      if (!adminDetails)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      if (user.superRoleId === 1) {
        const credentials = await db.GlobalSetting.findAll({
          attributes: ["key", "value"],
          where: { key: ["SENDGRID_API_KEY", "SENDGRID_EMAIL"] },
          raw: true,
        });

        credentials.forEach((credential) => {
          credential.value = decodeCredential(credential.value);
        });

        adminDetails.dataValues.sendgridCredentials = credentials;
      }

      delete adminDetails.dataValues.password;

      return { adminDetails, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      console.log(error, "---------------err---------------");
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
