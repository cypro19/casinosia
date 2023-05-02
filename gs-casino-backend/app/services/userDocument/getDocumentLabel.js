import { Op } from "sequelize";

import db from "../../db/models";
import { getAll } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { STATUS_VALUE } from "../../utils/constant";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  user: {
    presence: { allowEmpty: false },
  },
};

export class GetDocumentLabelService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { user } = this.filteredArgs;

    try {
      let query = { isRequired: true };

      if (user.documentLabels) {
        if (user.kycStatus === STATUS_VALUE.RE_REQUESTED) {
          query = { documentLabelId: { [Op.in]: user.documentLabels } };
        } else {
          query = {
            [Op.or]: {
              ...query,
              documentLabelId: { [Op.in]: user.documentLabels },
            },
          };
        }
      }

      const documentLabel = await getAll({
        model: db.DocumentLabel,
        data: query,
        attributes: ["documentLabelId", "name"],
      });

      if (!documentLabel)
        return this.addError(
          ERRORS.BAD_DATA,
          "Document Labels " + ERROR_MSG.NOT_EXISTS
        );

      return { documentLabel, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
