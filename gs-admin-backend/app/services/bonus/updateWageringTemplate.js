import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { getOne, updateEntity } from "../helper/crud";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { ROLE } from "../../utils/constant";

const constraints = {
  wageringTemplateId: {
    type: "integer",
    presence: { allowNull: false },
  },
  name: {
    presence: false,
  },
  gameContribution: {
    presence: false,
  },
  id: {
    presence: { allowNull: false },
  },
  userType: {
    presence: { allowNull: false },
  },
  user: {
    presence: { allowNull: false },
  },
};

export class UpdateWageringTemplateService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let { wageringTemplateId, name, gameContribution, id, userType, user } =
      this.filteredArgs;

    try {
      let query = { wageringTemplateId };
      if (userType === ROLE.ADMIN) {
        if (user.adminRoleId !== 1) {
          query = { ...query, parentType: userType, parentId: user.parentId };
        } else {
          query = { ...query, parentType: userType, parentId: id };
        }
      }
      const checkTemplateExists = await getOne({
        model: db.WageringTemplate,
        data: query,
      });

      if (!checkTemplateExists)
        return this.addError(
          ERRORS.BAD_DATA,
          "Wagering Template " + ERROR_MSG.NOT_FOUND
        );

      if (gameContribution) {
        // order of objects should not be changed
        gameContribution = {
          ...checkTemplateExists.gameContribution,
          ...gameContribution,
        };

        Object.keys(gameContribution).forEach((key) => {
          if (gameContribution[key] === 100) delete gameContribution[key];
        });
      }

      const updatedTemplate = await updateEntity({
        model: db.WageringTemplate,
        values: { wageringTemplateId },
        data: { name, gameContribution },
      });

      return { updatedTemplate, message: SUCCESS_MSG.UPDATE_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
