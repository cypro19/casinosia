import db from "../../db/models";
import { getOne } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  order: {
    presence: true,
  },
  masterGameCategoryId: {
    presence: true,
  },
};

export class OrderSubGameCategoryService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let { order, masterGameCategoryId } = this.filteredArgs;

    order = [...new Set(order)];

    try {
      const masterGameCategory = await getOne({
        model: db.MasterGameCategory,
        data: { masterGameCategoryId },
        include: [
          { model: db.MasterGameSubCategory, as: "masterGameSubCategory" },
        ],
      });

      if (!masterGameCategory)
        return this.addError(
          ERRORS.BAD_DATA,
          "Master Game Category " + ERROR_MSG.NOT_EXISTS
        );

      const masterGameSubCategory = masterGameCategory.masterGameSubCategory;

      if (masterGameSubCategory.length !== order.length)
        return this.addError(
          ERRORS.BAD_DATA,
          ERROR_MSG.ORDER_ERROR + `total: ${masterGameSubCategory.length}`
        );

      masterGameSubCategory.forEach(async (category) => {
        if (order.indexOf(category.masterGameSubCategoryId) !== -1) {
          await category
            .set({
              orderId: order.indexOf(category.masterGameSubCategoryId) + 1,
            })
            .save();
        }
      });

      return {
        success: masterGameSubCategory,
        message: SUCCESS_MSG.UPDATE_SUCCESS,
      };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
