import db from "../../db/models";
import { ERRORS } from "../../utils/errors";
import { ROLE } from "../../utils/constant";
import { createNewEntity } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";

const constraints = {
  name: {
    presence: { allowNull: false },
  },
  userType: {
    presence: { allowNull: false },
  },
  gameContribution: {
    presence: false,
  },
  adminIds: {
    presence: false,
  },
  user: {
    presence: false,
  },
};

export class CreateWageringTemplateService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { name, userType, gameContribution, adminIds, user } =
      this.filteredArgs;

    try {
      if (userType === ROLE.SUPERADMIN && adminIds.length) {
        adminIds.forEach(async (id) => {
          await createNewEntity({
            model: db.WageringTemplate,
            data: {
              name,
              parentType: ROLE.ADMIN,
              parentId: id,
              gameContribution,
            },
          });
        });
      } else {
        await createNewEntity({
          model: db.WageringTemplate,
          data: {
            name,
            parentType: userType,
            parentId: user.parentId,
            gameContribution,
          },
        });
      }

      return { success: true, message: SUCCESS_MSG.CREATE_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
