import { Op } from "sequelize";
import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { getUserDetails } from "../../utils/common";
import { insertUpdate } from "../helper/customerIo";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { updateEntity, getOne, getAll } from "../helper/crud";
import { createConnection, customerObject } from "../helper/rabbitMq";
import {
  EMAIL_SUBJECTS,
  EMAIL_TEMPLATE_TYPES,
  STATUS,
  STATUS_VALUE,
} from "../../utils/constant";
import {
  createEmailWithDynamicValues,
  getSendGridCredentials,
  sendDynamicMail,
} from "../helper/email";

const constraints = {
  userId: {
    type: "integer",
    presence: { allowEmpty: false },
  },
  userDocumentId: {
    type: "integer",
    presence: { allowEmpty: false },
  },
  status: {
    inclusion: {
      within: ["approved", "rejected"],
      message: "'%{value}' is not allowed",
    },
    presence: { allowEmpty: false },
  },
  reason: {
    presence: false,
  },
  user: {
    presence: { allowEmpty: false },
  },
};

export class VerifyUserDocumentService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let { userId, userDocumentId, status, reason, user } = this.filteredArgs;

    try {
      const userExist = await getUserDetails(userId);

      if (!userExist)
        return this.addError(ERRORS.BAD_DATA, "User " + ERROR_MSG.NOT_EXISTS);

      const checkDocumentExist = await getOne({
        model: db.UserDocument,
        data: { userDocumentId, userId: userExist.userId },
      });

      if (!checkDocumentExist)
        return this.addError(
          ERRORS.BAD_DATA,
          "User Document " + ERROR_MSG.NOT_FOUND
        );

      if (
        checkDocumentExist.status !== STATUS.PENDING &&
        checkDocumentExist.status !== STATUS.REREQUESTED
      ) {
        return this.addError(ERRORS.METHOD_NOT_ALLOWED, ERROR_MSG.NOT_ALLOWED);
      }

      const credentials = await getSendGridCredentials();

      if (status.toUpperCase() === STATUS_VALUE.APPROVED) {
        status = STATUS.APPROVED;

        if (Object.keys(credentials).length === 2) {
          const dynamicEmail = await createEmailWithDynamicValues({
            emailType:
              EMAIL_TEMPLATE_TYPES.VALUE_T0_INT[
                EMAIL_TEMPLATE_TYPES.KYC_APPROVED
              ],
            userId: userExist.userId,
            serviceData: {
              subject: EMAIL_SUBJECTS.kycApproved,
              kycLabels: checkDocumentExist.documentName,
            },
          });

          await sendDynamicMail({
            user: userExist,
            credentials,
            subject: EMAIL_SUBJECTS.kycApproved,
            successMsg: SUCCESS_MSG.EMAIL_SUCCESS,
            dynamicEmail,
            senderName: "----------",
          });
        }
      } else if (status.toUpperCase() === STATUS_VALUE.REJECTED) {
        status = STATUS.REJECTED;

        await userExist.set({ kycStatus: STATUS_VALUE.REJECTED }).save();
        insertUpdate(userExist.userId, { kyc_status: STATUS_VALUE.REJECTED });

        userExist.domainName = userExist?.domain;
        const customerDetails = await customerObject(userExist);
        await createConnection("PostCustomers", customerDetails);

        if (Object.keys(credentials).length === 2) {
          const dynamicEmail = await createEmailWithDynamicValues({
            emailType:
              EMAIL_TEMPLATE_TYPES.VALUE_T0_INT[
                EMAIL_TEMPLATE_TYPES.KYC_REJECTED
              ],
            userId: userExist.userId,
            serviceData: {
              subject: EMAIL_SUBJECTS.kycRejected,
              kycLabels: checkDocumentExist.documentName,
              reason,
            },
          });

          await sendDynamicMail({
            user: userExist,
            credentials,
            subject: EMAIL_SUBJECTS.kycRejected,
            successMsg: SUCCESS_MSG.EMAIL_SUCCESS,
            dynamicEmail,
            senderName: "--------------",
          });
        }
      }

      const updateUserDocument = await updateEntity({
        model: db.UserDocument,
        values: { userDocumentId },
        data: {
          status,
          reason,
          actionee: user.email,
          actionPerformedAt: Date.now(),
        },
      });

      if (userExist.kycStatus === STATUS_VALUE.REQUESTED) {
        const documentLabel = await getAll({
          model: db.DocumentLabel,
          data: { documentLabelId: { [Op.in]: userExist.documentLabels } },
          attributes: ["name"],
        });

        const total = documentLabel.length;

        const count = await db.UserDocument.count({
          where: { userId: userExist.userId, status: STATUS.APPROVED },
        });

        if (count === total) {
          await userExist.set({ kycStatus: STATUS_VALUE.APPROVED }).save();

          userExist.domainName = userExist?.domain;
          const customerDetails = await customerObject(userExist);
          await createConnection("PostCustomers", customerDetails);
          insertUpdate(userExist.userId, { kyc_status: STATUS_VALUE.APPROVED });

          const credentials = await getSendGridCredentials();

          if (Object.keys(credentials).length === 2) {
            const dynamicEmail = await createEmailWithDynamicValues({
              emailType:
                EMAIL_TEMPLATE_TYPES.VALUE_T0_INT[
                  EMAIL_TEMPLATE_TYPES.KYC_VERIFIED
                ],
              userId: userExist.userId,
              serviceData: {
                subject: EMAIL_SUBJECTS.kycVerified,
              },
            });

            await sendDynamicMail({
              user: userExist,
              credentials,
              subject: EMAIL_SUBJECTS.kycVerified,
              successMsg: SUCCESS_MSG.EMAIL_SUCCESS,
              dynamicEmail,
              senderName: "-------------",
            });
          }
        }
      }

      return { updateUserDocument, message: SUCCESS_MSG.UPDATE_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
