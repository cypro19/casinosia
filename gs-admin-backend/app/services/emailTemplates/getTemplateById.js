import db from "../../db/models";
import { ROLE } from "../../utils/constant";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { getOne } from "../helper/crud";

const constraints = {
  emailTemplateId: {
    presence: { allowEmpty: false },
  },
  userType: {
    presence: { allowEmpty: false },
  },
};

export class GetEmailTemplateService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { emailTemplateId, userType } = this.filteredArgs;

    try {
      let query;
      if (userType === ROLE.SUPERADMIN) {
        query = { emailTemplateId, isDefault: true };
      } else if (userType === ROLE.ADMIN) {
        query = { emailTemplateId };
      }

      const emailTemplate = await getOne({
        model: db.EmailTemplate,
        data: query,
      });

      if (!emailTemplate)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { emailTemplate };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
