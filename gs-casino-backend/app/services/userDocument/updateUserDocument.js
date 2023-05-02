import { Op } from "sequelize";

import db from "../../db/models";
import config from "../../../config/app";
import { ERRORS } from "../../utils/errors";
import { s3Client } from "../../utils/common";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { updateEntity, getOne, createNewEntity, getAll } from "../helper/crud";
import {
  createEmailWithDynamicValues,
  getSendGridCredentials,
  sendDynamicMail,
} from "../helper/email";
import {
  STATUS_VALUE,
  STATUS,
  EMAIL_TEMPLATE_TYPES,
  EMAIL_SUBJECTS,
  DEFAULT_LANGUAGE,
} from "../../utils/constant";

const constraints = {
  id: {
    presence: { allowEmpty: false },
  },
  document: {
    presence: { allowEmpty: false },
  },
  user: {
    presence: { allowEmpty: false },
  },
  origin: {
    presence: { allowEmpty: false },
  },
  siteName: {
    presence: { allowEmpty: false },
  },
  labelId: {
    presence: { allowEmpty: false },
  },
};

export class UpdateDocumentService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let { document, id, user, siteName, origin, labelId } = this.filteredArgs;

    try {
      let query = { isRequired: true };
      document = document[0];

      if (user.kycStatus === STATUS_VALUE.RE_REQUESTED) {
        query = { documentLabelId: { [Op.in]: user.documentLabels } };
      } else if (user.documentLabels)
        query = {
          [Op.or]: {
            ...query,
            documentLabelId: { [Op.in]: user.documentLabels },
          },
        };

      const documentLabel = await getAll({
        model: db.DocumentLabel,
        data: query,
        attributes: ["documentLabelId"],
      });

      const labels = [];
      documentLabel.forEach((element) => {
        labels.push(element.dataValues.documentLabelId);
      });

      let updateData = { status: 0, reason: null };
      const label = document.fieldname.split("_");

      if (document && typeof document === "object") {
        const checkUserDocumentExist = await getOne({
          model: db.UserDocument,
          data: {
            userId: id,
            [Op.or]: {
              documentName: label[0],
              userDocumentId: label[1] ? label[1] : null,
            },
          },
        });

        const documentBucketParams = {
          Bucket: config.get("aws.bucket"),
          Key: "default",
          Body: document.buffer,
          ACL: "public-read",
          ContentType: document.mimetype,
        };

        let dataObject, dataValues;

        if (!checkUserDocumentExist) {
          const createUserDocument = await createNewEntity({
            model: db.UserDocument,
            data: { userId: id, documentName: label[0] },
          });

          const fileName = `user_document/doc_name_${label[0]}_user_${
            createUserDocument.userId
          }_doc_id_${createUserDocument.userDocumentId}-${Date.now()}.${
            document.mimetype.split("/")[1]
          }`;

          documentBucketParams["Key"] = fileName.split(" ").join("");

          const documentS3 = await s3Client()
            .upload(documentBucketParams)
            .promise();
          dataObject = { documentUrl: [documentS3.Location] };
          dataValues = { userDocumentId: createUserDocument.userDocumentId };
        } else {
          const fileName = `user_document/doc_name_${
            checkUserDocumentExist.documentName
          }_user_${checkUserDocumentExist.userId}_doc_id_${
            checkUserDocumentExist.userDocumentId
          }-${Date.now()}.${document.mimetype.split("/")[1]}`;

          documentBucketParams["Key"] = fileName.split(" ").join("");

          if (checkUserDocumentExist.status === STATUS.REREQUESTED) {
            const documentS3 = await s3Client()
              .upload(documentBucketParams)
              .promise();
            const { Location } = documentS3;
            checkUserDocumentExist.documentUrl.push(Location);
            updateData = {
              ...updateData,
              documentUrl: checkUserDocumentExist.documentUrl,
            };
          } else {
            const urlArray = checkUserDocumentExist.dataValues.documentUrl;
            const url = urlArray[urlArray.length - 1];
            const deleteParams = { Bucket: config.get("aws.bucket"), Key: url };

            await s3Client().deleteObject(deleteParams).promise();

            const documentS3 = await s3Client()
              .upload(documentBucketParams)
              .promise();
            const { Location } = documentS3;
            urlArray[urlArray.length - 1] = Location;
            updateData = { ...updateData, documentUrl: urlArray };
          }

          dataObject = { ...updateData, documentName: label[0] };
          dataValues = {
            userDocumentId: checkUserDocumentExist.userDocumentId,
          };
        }
        await updateEntity({
          model: db.UserDocument,
          values: dataValues,
          data: dataObject,
        });
      }

      let userUpdate;
      if (user.documentLabels)
        userUpdate = {
          documentLabels: [...user.documentLabels, parseInt(labelId)],
        };
      else userUpdate = { documentLabels: [parseInt(labelId)] };

      if (user.requestedDocuments) {
        const index = user.requestedDocuments.indexOf(parseInt(labelId));
        if (index !== -1) {
          user.requestedDocuments.splice(index, 1);
          userUpdate = {
            ...userUpdate,
            requestedDocuments: user.requestedDocuments,
          };
        }
      }

      const getUserDocument = await db.UserDocument.count({
        where: { userId: id },
      });

      if (documentLabel.length === getUserDocument) {
        userUpdate = { ...userUpdate, kycStatus: STATUS_VALUE.REQUESTED };

        const credentials = await getSendGridCredentials();

        if (Object.keys(credentials).length === 2) {
          const dynamicEmail = await createEmailWithDynamicValues({
            language: user.locale || DEFAULT_LANGUAGE,
            emailType:
              EMAIL_TEMPLATE_TYPES.VALUE_T0_INT[
                EMAIL_TEMPLATE_TYPES.KYC_RECEIVED
              ],
            userId: user.userId,
            serviceData: {
              subject: EMAIL_SUBJECTS.kycReceived,
            },
          });

          await sendDynamicMail({
            user: user,
            credentials,
            subject: EMAIL_SUBJECTS.kycReceived,
            successMsg: SUCCESS_MSG.EMAIL_SENT,
            senderName: siteName,
            dynamicEmail,
          });
        }
      } else if (user.kycStatus !== STATUS_VALUE.PENDING)
        userUpdate = { ...userUpdate, kycStatus: STATUS_VALUE.PENDING };

      await user.set(userUpdate).save();
      user.domainName = origin;

      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
