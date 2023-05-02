import db from "../../db/models";
import { Op } from "sequelize";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { getOne, updateEntity } from "../helper/crud";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  documentLabelId: {
    presence: { allowEmpty: false },
  },
  name: {
    presence: false,
  },
  isRequired: {
    type: "boolean",
    presence: false,
  },
};

export class UpdateDocumentLabelService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { documentLabelId, name, isRequired } = this.filteredArgs;

    const t = await db.sequelize.transaction();

    try {
      const checkLabelExists = await getOne({
        model: db.DocumentLabel,
        data: { documentLabelId },
      });

      if (!checkLabelExists) {
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.NOT_FOUND);
      }

      const updatedLabel = await updateEntity({
        model: db.DocumentLabel,
        values: { documentLabelId },
        data: { name: { ...checkLabelExists.name, ...name }, isRequired },
        transaction: t,
      });

      await t.commit();
      return { updatedLabel, message: SUCCESS_MSG.UPDATE_SUCCESS };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
