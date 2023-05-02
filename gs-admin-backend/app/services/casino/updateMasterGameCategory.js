import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { getOne, updateEntity } from "../helper/crud";

const constraints = {
  masterGameCategoryId: {
    type: "integer",
    presence: { allowEmpty: false },
  },
  name: {
    length: {
      minimum: 1,
      maximum: 200,
    },
    presence: { allowEmpty: false },
  },
};

export class UpdateMasterGameCategoryService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { masterGameCategoryId, name } = this.filteredArgs;

    const t = await db.sequelize.transaction();

    try {
      const checkCategoryExists = await getOne({
        model: db.MasterGameCategory,
        data: { masterGameCategoryId },
      });

      if (!checkCategoryExists) {
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.NOT_FOUND);
      }

      if (checkCategoryExists.name !== name) {
        const nameExists = await getOne({
          model: db.MasterGameCategory,
          data: { name },
        });

        if (nameExists) {
          return this.addError(
            ERRORS.BAD_DATA,
            "Master game category name " + ERROR_MSG.EXISTS
          );
        }
      }

      const updatedGameCategory = await updateEntity({
        model: db.MasterGameCategory,
        values: { masterGameCategoryId },
        data: { name },
        transaction: t,
      });

      await t.commit();
      return { updatedGameCategory, message: SUCCESS_MSG.UPDATE_SUCCESS };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
