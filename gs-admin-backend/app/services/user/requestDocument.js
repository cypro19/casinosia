import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { insertUpdate } from "../helper/customerIo";
import { getOne, updateEntity } from "../helper/crud";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import {
  STATUS_VALUE,
  STATUS,
  EMAIL_TEMPLATE_TYPES,
  EMAIL_SUBJECTS,
} from "../../utils/constant";
import { createConnection, customerObject } from "../helper/rabbitMq";
import {
  createEmailWithDynamicValues,
  getSendGridCredentials,
  sendDynamicMail,
} from "../helper/email";

const constraints = {
  user: {
    presence: { allowEmpty: false },
  },
  documentLabelId: {
    presence: { allowNull: false },
  },
  userId: {
    presence: { allowNull: false },
  },
  reRequested: {
    presence: false,
  },
  reason: {
    presence: false,
  },
};

export class RequestDocumentService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { documentLabelId, userId, reRequested, reason, user } =
      this.filteredArgs;

    try {
      const userDetails = await getOne({
        model: db.User,
        data: { userId },
        include: [
          {
            model: db.UserDocument,
            as: "userDocuments",
            attributes: ["userDocumentId"],
          },
          { model: db.Wallet, as: "userWallet" },
        ],
      });

      if (!userDetails)
        return this.addError(ERRORS.BAD_DATA, "User " + ERROR_MSG.NOT_FOUND);

      let label = [documentLabelId];
      let kycStatus = STATUS_VALUE.PENDING;
      let updateObject = { kycStatus };
      let requestedDocuments = [documentLabelId];

      if (reRequested) {
        await updateEntity({
          model: db.UserDocument,
          values: { userDocumentId: documentLabelId },
          data: {
            status: STATUS.REREQUESTED,
            reason,
            actionee: user.email,
            actionPerformedAt: Date.now(),
          },
        });
      } else {
        if (userDetails.documentLabels)
          label = [documentLabelId, ...userDetails.documentLabels];
        if (userDetails.requestedDocuments)
          requestedDocuments = [
            documentLabelId,
            ...userDetails.requestedDocuments,
          ];

        if (
          userDetails.userDocuments.length === 0 &&
          (userDetails.kycStatus === STATUS_VALUE.APPROVED ||
            userDetails.kycStatus === STATUS_VALUE.RE_REQUESTED)
        ) {
          kycStatus = STATUS_VALUE.RE_REQUESTED;
        }

        updateObject = {
          ...updateObject,
          requestedDocuments,
          documentLabels: label,
        };
      }

      await userDetails.set(updateObject).save();
      insertUpdate(userId, { kyc_status: updateObject.kycStatus });

      userDetails.domainName = userDetails?.domain;
      const customerDetails = await customerObject(userDetails);
      await createConnection("PostCustomers", customerDetails);

      const credentials = await getSendGridCredentials();

      if (Object.keys(credentials).length === 2) {
        const dynamicEmail = await createEmailWithDynamicValues({
          emailType:
            EMAIL_TEMPLATE_TYPES.VALUE_T0_INT[
              EMAIL_TEMPLATE_TYPES.KYC_REQUESTED
            ],
          userId: userDetails.userId,
          serviceData: {
            subject: EMAIL_SUBJECTS.kycRequested,
            kycLabels: "DEFAULT",
          },
        });

        await sendDynamicMail({
          user: userDetails,
          credentials,
          subject: EMAIL_SUBJECTS.kycRequested,
          successMsg: SUCCESS_MSG.EMAIL_SENT,
          dynamicEmail,
          senderName: "-----------------",
        });
      }

      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
