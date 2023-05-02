import db from "../../db/models";
import { Op } from "sequelize";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { getOne, createNewEntity } from "../helper/crud";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  name: {
    presence: { allowNull: false },
  },
  isRequired: {
    type: "boolean",
    presence: false,
  },
};

export class CreateDocumentLabelService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { name, isRequired } = this.filteredArgs;

    const t = await db.sequelize.transaction();

    try {
      const checkLabelExists = await getOne({
        model: db.DocumentLabel,
        data: { name: { [Op.contains]: { EN: name["EN"] } } },
      });

      if (checkLabelExists) {
        return this.addError(ERRORS.BAD_DATA, "Label " + ERROR_MSG.EXISTS);
      }

      const label = await createNewEntity({
        model: db.DocumentLabel,
        data: { name, isRequired },
        transaction: t,
      });

      await t.commit();
      return { label, message: SUCCESS_MSG.CREATE_SUCCESS };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
