import db from "../../db/models";
import { EMAIL_TEMPLATE_PRIMARY_STATUS, ROLE } from "../../utils/constant";
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
};

export class DeleteEmailTemplateService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { userType, emailTemplateId } = this.filteredArgs;

    try {
      let query;

      if (userType === ROLE.ADMIN) {
        query = { emailTemplateId };
      }

      const emailTemplate = await getOne({
        model: db.EmailTemplate,
        data: query,
      });

      if (!emailTemplate)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      if (emailTemplate.isPrimary === EMAIL_TEMPLATE_PRIMARY_STATUS.PRIMARY) {
        return this.addError(
          ERRORS.BAD_REQUEST,
          ERROR_MSG.DELETE_PRIMARY_EMAIL
        );
      }

      await emailTemplate.destroy();

      return { success: true };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
