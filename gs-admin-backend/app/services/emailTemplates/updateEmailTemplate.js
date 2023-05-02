import db from "../../db/models";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { getOne } from "../helper/crud";
import { ROLE } from "../../utils/constant";

const constraints = {
  emailTemplateId: {
    presence: { allowEmpty: false },
  },
  label: {
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

export class UpdateEmailTemplateService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const {
      label,
      id,
      userType,
      dynamicData,
      templateCode,
      emailTemplateId,
      language,
    } = this.filteredArgs;

    const t = await db.sequelize.transaction();

    try {
      let query;

      if (userType === ROLE.SUPERADMIN) {
        query = { isDefault: true };
      } else if (userType === ROLE.ADMIN) {
        query = { adminId: id };
      }

      const checkTemplateExists = await getOne({
        model: db.EmailTemplate,
        data: { ...query, emailTemplateId },
      });

      if (!checkTemplateExists) {
        return this.addError(
          ERRORS.BAD_DATA,
          "Template " + ERROR_MSG.NOT_EXISTS
        );
      }

      const newTemplateCode = checkTemplateExists.templateCode;
      newTemplateCode[language] = templateCode;

      const templateData = {
        label,
        dynamicData,
        templateCode: newTemplateCode,
      };

      const emailTemplate = await checkTemplateExists
        .set(templateData)
        .save({ transaction: t });

      await t.commit();
      return { emailTemplate };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
