import db from "../../db/models";
import { getOne, getAll } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  order: {
    presence: true,
  },
};

export class OrderCategoryGamesService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let { order } = this.filteredArgs;
    order = [...new Set(order)];

    try {
      const masterGameCategory = await getAll({
        model: db.MasterGameCategory,
      });

      if (!masterGameCategory)
        return this.addError(
          ERRORS.BAD_DATA,
          "Master Game Category " + ERROR_MSG.NOT_EXISTS
        );

      masterGameCategory.forEach(async (game) => {
        if (order.indexOf(game.masterGameCategoryId) !== -1) {
          await game
            .set({ orderId: order.indexOf(game.masterGameCategoryId) + 1 })
            .save();
        }
      });

      return {
        success: masterGameCategory,
        message: SUCCESS_MSG.UPDATE_SUCCESS,
      };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
