import { Op, Sequelize } from "sequelize";
import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { insertUpdate } from "../helper/customerIo";
import { getAll, updateEntity } from "../helper/crud";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { STATUS_VALUE, STATUS } from "../../utils/constant";
import { getUserDetails } from "../../utils/common";
import { createConnection, customerObject } from "../helper/rabbitMq";

const constraints = {
  documentLabelId: {
    presence: { allowNull: false },
  },
  userId: {
    presence: { allowNull: false },
  },
  reRequested: {
    presence: false,
  },
};

export class CancelDocumentRequestService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { documentLabelId, userId, reRequested } = this.filteredArgs;

    try {
      let data;
      let statusValue = STATUS_VALUE.PENDING;
      const userDetails = await getUserDetails(userId);

      if (!userDetails)
        return this.addError(ERRORS.BAD_DATA, "User " + ERROR_MSG.NOT_FOUND);

      if (reRequested) {
        await updateEntity({
          model: db.UserDocument,
          values: { userDocumentId: documentLabelId },
          data: { status: STATUS.APPROVED },
        });
      } else {
        const index = userDetails.documentLabels.indexOf(documentLabelId);
        const docIndex =
          userDetails.requestedDocuments.indexOf(documentLabelId);
        userDetails.documentLabels.splice(index, 1);
        userDetails.requestedDocuments.splice(docIndex, 1);

        if (!userDetails.documentLabels.length)
          userDetails.documentLabels = null;
        if (!userDetails.requestedDocuments.length)
          userDetails.requestedDocuments = null;

        data = {
          documentLabels: userDetails.documentLabels,
          requestedDocuments: userDetails.requestedDocuments,
        };
      }

      const statusCount = await getAll({
        model: db.UserDocument,
        attributes: [
          "status",
          [
            Sequelize.literal("COUNT(DISTINCT(user_document_id))"),
            "documentCount",
          ],
        ],
        data: { userId },
        group: ["status"],
      });

      if (statusCount.length) {
        let totalCount = 0;
        statusCount.forEach((status) => {
          totalCount += parseInt(status.dataValues.documentCount);
        });

        const documentLabel = await getAll({
          model: db.DocumentLabel,
          data: { documentLabelId: { [Op.in]: userDetails.documentLabels } },
          attributes: ["name"],
        });
        const total = documentLabel.length;

        if (total === totalCount) {
          statusValue = STATUS_VALUE.REQUESTED;

          for (let index = 0; index < statusCount.length; index++) {
            if (statusCount[index].status === STATUS.REJECTED) {
              statusValue = STATUS_VALUE.REJECTED;
              break;
            } else if (statusCount[index].status === STATUS.APPROVED) {
              if (
                parseInt(statusCount[index].dataValues.documentCount) === total
              ) {
                statusValue = STATUS_VALUE.APPROVED;
                break;
              }
            }
          }
        }
      } else if (
        statusCount.length === 0 &&
        userDetails.kycStatus === STATUS_VALUE.RE_REQUESTED
      ) {
        if (userDetails.documentLabels) statusValue = STATUS_VALUE.RE_REQUESTED;
        else statusValue = STATUS_VALUE.APPROVED;
      }

      await userDetails.set({ ...data, kycStatus: statusValue }).save();

      userDetails.domainName = userDetails?.domain;
      const customerDetails = await customerObject(userDetails);
      await createConnection("PostCustomers", customerDetails);
      insertUpdate(userId, { kyc_status: statusValue });

      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
