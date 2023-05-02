import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { createNewEntity, getOne } from "../helper/crud";
import { Op } from "sequelize";

const constraints = {
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

export class CreateGameSubCategoryService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { name, user, iconColor, iconName, masterGameCategoryId, isActive } =
      this.filteredArgs;

    const t = await db.sequelize.transaction();

    try {
      const checkSubCategoryExists = await getOne({
        model: db.MasterGameSubCategory,
        data: {
          name: { [Op.contains]: { EN: name["EN"] } },
          masterGameCategoryId,
        },
        include: {
          model: db.MasterGameCategory,
          where: { masterGameCategoryId: masterGameCategoryId },
        },
      });

      if (checkSubCategoryExists) {
        return this.addError(
          ERRORS.BAD_DATA,
          "Sub category " + ERROR_MSG.EXISTS
        );
      }

      const checkGameCategory = await getOne({
        model: db.MasterGameCategory,
        data: { masterGameCategoryId },
      });

      if (!checkGameCategory)
        return this.addError(
          ERRORS.BAD_DATA,
          "Category " + ERROR_MSG.NOT_EXISTS
        );

      let lastOrderId = await db.MasterGameSubCategory.max("orderId", {
        where: { masterGameCategoryId },
      });
      if (!lastOrderId) lastOrderId = 0;
      // var name ={"EN":name };
      const createSubCategory = await createNewEntity({
        model: db.MasterGameSubCategory,
        data: {
          name,
          masterGameCategoryId,
          iconColor,
          iconName,
          isActive,
          orderId: lastOrderId ? lastOrderId + 1 : 1,
        },
        transaction: t,
      });

      await t.commit();
      return { createSubCategory, message: SUCCESS_MSG.CREATE_SUCCESS };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
