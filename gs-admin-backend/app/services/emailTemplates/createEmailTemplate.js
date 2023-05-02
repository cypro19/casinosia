/* eslint-disable no-useless-escape */
import db from "../../db/models";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { getOne, createNewEntity } from "../helper/crud";
import { EMAIL_TEMPLATE_PRIMARY_STATUS, ROLE } from "../../utils/constant";

const constraints = {
  label: {
    presence: { allowEmpty: false },
  },
  type: {
    inclusion: {
      within: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      message: "can be 0 to 16",
    },
    presence: { allowEmpty: false },
  },
  id: {
    presence: { allowEmpty: false },
  },
  userType: {
    presence: { allowEmpty: false },
  },
  dynamicData: {
    presence: false,
  },
  templateCode: {
    presence: { allowEmpty: false },
  },
  language: {
    presence: { allowEmpty: false },
  },
};

export class CreateEmailTemplateService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { label, type, id, userType, dynamicData, templateCode, language } =
      this.filteredArgs;

    const t = await db.sequelize.transaction();

    try {
      let adminId;

      if (userType === ROLE.ADMIN) adminId = id;

      const checkTemplateExists = await getOne({
        model: db.EmailTemplate,
        data: { label, adminId, type },
      });

      if (checkTemplateExists) {
        return this.addError(ERRORS.BAD_DATA, "label " + ERROR_MSG.EXISTS);
      }

      const newTemplateCode = {};
      newTemplateCode[language] = templateCode;

      const templateData = {
        adminId,
        type,
        label,
        dynamicData,
        templateCode: newTemplateCode,
        isPrimary: EMAIL_TEMPLATE_PRIMARY_STATUS.DISABLE,
      };

      const emailTemplate = await createNewEntity({
        model: db.EmailTemplate,
        data: templateData,
        transaction: t,
      });

      await t.commit();
      return { emailTemplate };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
