import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { getOne, updateEntity } from "../helper/crud";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  casinoSubCategoryId: {
    type: "integer",
    presence: { allowEmpty: false },
  },
  name: {
    presence: { allowEmpty: false },
  },
  user: {
    presence: { allowEmpty: false },
  },
  iconColor: {
    presence: false,
  },
  iconName: {
    presence: false,
  },
  masterGameCategoryId: {
    presence: { allowEmpty: false },
  },
  isActive: {
    presence: false,
  },
};

export class UpdateGameSubCategoryService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const {
      casinoSubCategoryId,
      name,
      iconColor,
      iconName,
      masterGameCategoryId,
      user,
      isActive,
    } = this.filteredArgs;

    const t = await db.sequelize.transaction();

    try {
      const checkCasinoSubCategoryExists = await getOne({
        model: db.MasterGameSubCategory,
        data: { masterGameSubCategoryId: casinoSubCategoryId },
      });

      if (!checkCasinoSubCategoryExists) {
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.NOT_FOUND);
      }

      if (
        checkCasinoSubCategoryExists.name["EN"] !== name["EN"] ||
        checkCasinoSubCategoryExists.masterGameCategoryId !==
          masterGameCategoryId
      ) {
        const checkGameCategory = await getOne({
          model: db.MasterGameCategory,
          data: { masterGameCategoryId },
        });

        if (!checkGameCategory)
          return this.addError(
            ERRORS.BAD_DATA,
            "Category " + ERROR_MSG.NOT_EXISTS
          );
        const subCategoryExists = await getOne({
          model: db.MasterGameSubCategory,
          data: { name, masterGameCategoryId },
        });

        if (subCategoryExists) {
          return this.addError(
            ERRORS.BAD_DATA,
            "Casino Sub Category " + ERROR_MSG.EXISTS
          );
        }
      }

      const updatedCasinoSubCategory = await updateEntity({
        model: db.MasterGameSubCategory,
        values: { masterGameSubCategoryId: casinoSubCategoryId },
        data: {
          name: { ...checkCasinoSubCategoryExists.name, ...name },
          iconColor,
          iconName,
          masterGameCategoryId,
          isActive,
        },
        transaction: t,
      });

      await t.commit();
      return { updatedCasinoSubCategory, message: SUCCESS_MSG.UPDATE_SUCCESS };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
