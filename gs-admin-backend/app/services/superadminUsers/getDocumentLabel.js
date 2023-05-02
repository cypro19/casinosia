import { Op } from "sequelize";
import db from "../../db/models";
import { getAll, getOne } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { STATUS_VALUE } from "../../utils/constant";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  userId: {
    presence: false,
  },
};

export class GetDocumentLabelService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let query;
    const { userId } = this.filteredArgs;

    try {
      if (userId) {
        const userExist = await getOne({
          model: db.User,
          data: { userId },
          attributes: ["userId", "documentLabels", "kycStatus"],
        });

        if (userExist && userExist.documentLabels) {
          if (userExist.kycStatus === STATUS_VALUE.PENDING)
            query = { isRequired: false };
          query = {
            ...query,
            documentLabelId: { [Op.notIn]: userExist.documentLabels },
          };
        } else {
          query = { isRequired: false };
        }
      }

      const documentLabel = await getAll({
        model: db.DocumentLabel,
        data: query,
        attributes: { exclude: ["createdAt", "updatedAt"] },
        order: [["documentLabelId", "ASC"]],
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
