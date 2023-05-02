import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { getOne, createNewEntity } from "../helper/crud";

const constraints = {
  name: {
    length: {
      minimum: 1,
      maximum: 200,
    },
    presence: { allowEmpty: false },
  },
  isActive: {
    type: "boolean",
    presence: false,
  },
};

export class CreateAggregatorService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { name, isActive } = this.filteredArgs;

    const t = await db.sequelize.transaction();

    try {
      const checkAggregatorExists = await getOne({
        model: db.MasterGameAggregator,
        data: { name },
      });

      if (checkAggregatorExists) {
        return this.addError(ERRORS.BAD_DATA, "Aggregator " + ERROR_MSG.EXISTS);
      }

      const createAggregator = await createNewEntity({
        model: db.MasterGameAggregator,
        data: { name, isActive },
        transaction: t,
      });

      await t.commit();
      return { createAggregator, message: SUCCESS_MSG.CREATE_SUCCESS };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
