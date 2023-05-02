import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { getOne, updateEntity } from "../helper/crud";

const constraints = {
  casinoCategoryId: {
    type: "integer",
    presence: { allowEmpty: false },
  },
  name: {
    presence: { allowEmpty: false },
  },
  user: {
    presence: { allowEmpty: false },
  },
  isActive: {
    type: "boolean",
    presence: false,
  },
};

export class UpdateGameCategoryService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { name, user, casinoCategoryId, isActive } = this.filteredArgs;

    const t = await db.sequelize.transaction();

    try {
      const checkCategoryExists = await getOne({
        model: db.MasterGameCategory,
        data: { masterGameCategoryId: casinoCategoryId },
      });

      if (!checkCategoryExists) {
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.NOT_FOUND);
      }

      if (checkCategoryExists.name["EN"] !== name["EN"]) {
        const nameExists = await getOne({
          model: db.MasterGameCategory,
          data: { name },
        });

        if (nameExists) {
          return this.addError(
            ERRORS.BAD_DATA,
            "Category Name " + ERROR_MSG.EXISTS
          );
        }
      }

      const updateCategory = await updateEntity({
        model: db.MasterGameCategory,
        data: { name: { ...checkCategoryExists.name, ...name }, isActive },
        values: { masterGameCategoryId: casinoCategoryId },
        transaction: t,
      });

      await t.commit();
      return { updateCategory, message: SUCCESS_MSG.CREATE_SUCCESS };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
