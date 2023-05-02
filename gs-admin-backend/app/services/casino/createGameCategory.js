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
  isActive: {
    presence: false,
  },
};

export class CreateGameCategoryService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { name, isActive } = this.filteredArgs;

    const t = await db.sequelize.transaction();

    try {
      const checkCategoryExists = await getOne({
        model: db.MasterGameCategory,
        data: { name: { [Op.contains]: { EN: name["EN"] } } },
      });

      if (checkCategoryExists)
        return this.addError(ERRORS.BAD_DATA, "Category " + ERROR_MSG.EXISTS);

      let lastOrderId = await db.MasterGameCategory.max("orderId");
      if (!lastOrderId) lastOrderId = 0;

      const createCategory = await createNewEntity({
        model: db.MasterGameCategory,
        data: { name, isActive, orderId: lastOrderId + 1 },
        transaction: t,
      });

      await t.commit();
      return { createCategory, message: SUCCESS_MSG.CREATE_SUCCESS };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
