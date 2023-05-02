import db from "../../db/models";
import { ROLE, EMAIL_TEMPLATE_ORDER } from "../../utils/constant";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { createEmailTemplateData } from "../helper/email";

const constraints = {
  userType: {
    presence: { allowEmpty: false },
  },
  id: {
    presence: { allowEmpty: false },
  },
};

export class GetAllEmailTemplateService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { userType, id } = this.filteredArgs;

    try {
      let query;
      if (userType === ROLE.SUPERADMIN) {
        query = { isDefault: true };
      } else if (userType === ROLE.ADMIN) {
        query = { adminId: id };
      }

      const emailTemplate = await db.EmailTemplate.findAll({
        where: query,
      });

      if (!emailTemplate)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return {
        templateCount: emailTemplate.length,
        emailTemplateOrder: EMAIL_TEMPLATE_ORDER,
        emailTemplate: createEmailTemplateData(emailTemplate),
      };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
