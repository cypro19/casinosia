import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { getOne, updateEntity } from "../helper/crud";

const constraints = {
  masterGameSubCategoryId: {
    type: "integer",
    presence: { allowEmpty: false },
  },
  masterGameCategoryId: {
    presence: { allowEmpty: false },
  },
  name: {
    length: {
      minimum: 1,
      maximum: 200,
    },
    presence: { allowEmpty: false },
  },
  iconColor: {
    presence: { allowEmpty: false },
  },
  iconName: {
    presence: { allowEmpty: false },
  },
  isActive: {
    presence: false,
  },
};

export class UpdateMasterGameSubCategoryService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const {
      masterGameSubCategoryId,
      masterGameCategoryId,
      name,
      iconColor,
      iconName,
      isActive,
    } = this.filteredArgs;

    const t = await db.sequelize.transaction();

    try {
      const checkSubCategoryExists = await getOne({
        model: db.MasterGameSubCategory,
        data: { masterGameSubCategoryId },
      });

      if (!checkSubCategoryExists) {
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.NOT_FOUND);
      }

      if (checkSubCategoryExists.name !== name) {
        const nameExists = await getOne({
          model: db.MasterGameSubCategory,
          data: { name, masterGameCategoryId },
        });

        if (nameExists) {
          return this.addError(
            ERRORS.BAD_DATA,
            "Master game sub category name " + ERROR_MSG.EXISTS
          );
        }
      }

      const updatedGameSubCategory = await updateEntity({
        model: db.MasterGameSubCategory,
        values: { masterGameSubCategoryId },
        data: { name, iconColor, iconName, isActive },
        transaction: t,
      });

      await t.commit();
      return { updatedGameSubCategory, message: SUCCESS_MSG.UPDATE_SUCCESS };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
