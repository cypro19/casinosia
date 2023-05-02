import { Op } from "sequelize";
import db from "../../db/models";
import { getAll } from "../helper/crud";
import { ROLE } from "../../utils/constant";
import { ERRORS } from "../../utils/errors";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";

const constraints = {
  userType: {
    presence: { allowEmpty: false },
  },
  id: {
    presence: { allowEmpty: false },
  },
  type: {
    presence: false,
  },
  user: {
    presence: false,
  },
  email: {
    length: {
      minimum: 3,
    },
    presence: { allowEmpty: false },
  },
};

export class GetTransactionUsersService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { id, userType, type, user, email } = this.filteredArgs;

    try {
      let transactionUsers;

      if (userType === ROLE.SUPERADMIN) {
        transactionUsers = await db.sequelize.query(
          `
        WITH RECURSIVE children AS (
        SELECT super_admin_user_id, email, parent_id, 0 AS relative_depth
        FROM super_admin_users
        WHERE super_admin_user_id = :id

        UNION ALL

        SELECT parent.super_admin_user_id, parent.email, parent.parent_id, child.relative_depth + 1
        FROM super_admin_users parent
        INNER JOIN children child ON child.super_admin_user_id = parent.parent_id AND parent.email ILIKE :filterEmail)

        SELECT * FROM children
        WHERE super_admin_user_id != :id;
      `,
          {
            replacements: {
              id,
              filterEmail: `%${email}%`,
            },
          }
        );

        transactionUsers = transactionUsers[0];
      }
      return { transactionUsers, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
