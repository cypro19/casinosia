import db from "../../db/models";
import { ROLE } from "../../utils/constant";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { getOne } from "../helper/crud";

const constraints = {
  userType: {
    presence: { allowEmpty: false },
  },
  emailTemplateId: {
    presence: { allowEmpty: false },
  },
  language: {
    presence: { allowEmpty: false },
  },
};

export class DeleteEmailTemplateLanguageService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { userType, emailTemplateId, language } = this.filteredArgs;

    try {
      let query;

      if (userType === ROLE.ADMIN) {
        query = { emailTemplateId };
      } else if (userType === ROLE.SUPERADMIN) {
        query = { emailTemplateId };
      }

      const emailTemplate = await getOne({
        model: db.EmailTemplate,
        data: query,
      });

      if (!emailTemplate)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      if (language === "EN") {
        return this.addError(ERRORS.BAD_REQUEST, ERROR_MSG.NOT_ALLOWED);
      }

      delete emailTemplate.templateCode[language];

      await emailTemplate
        .set({ templateCode: emailTemplate.templateCode })
        .save();

      return { success: true };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
