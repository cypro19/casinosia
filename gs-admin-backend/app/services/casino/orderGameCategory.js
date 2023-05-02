import db from "../../db/models";
import { ERRORS } from "../../utils/errors";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { getOne, updateEntity } from "../helper/crud";

const constraints = {
  order: {
    presence: false,
  },
  user: {
    presence: { allowEmpty: false },
  },
};

export class OrderGameCategoryService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { order, user } = this.filteredArgs;

    try {
      order.forEach(async (id, index) => {
        const checkCategoryExists = await getOne({
          model: db.MasterGameCategory,
          data: { masterGameCategoryId: id },
        });
        if (checkCategoryExists) {
          await updateEntity({
            model: db.MasterGameCategory,
            data: { orderId: index + 1 },
            values: { masterGameCategoryId: id },
          });
        }
      });
      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
