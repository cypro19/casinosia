import db from "../../db/models";
import { EMAIL_TEMPLATE_PRIMARY_STATUS, ROLE } from "../../utils/constant";
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
  id: {
    presence: { allowEmpty: false },
  },
  type: {
    inclusion: {
      within: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      message: "can be 0 to 16",
    },
    presence: { allowEmpty: false },
  },
};

export class MarkEmailPrimaryService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { emailTemplateId, userType, id, type } = this.filteredArgs;

    try {
      let query;

      if (userType === ROLE.ADMIN) {
        query = { adminId: id };
      }

      const checkTemplateExists = await getOne({
        model: db.EmailTemplate,
        data: { ...query, emailTemplateId, type },
      });

      if (!checkTemplateExists) {
        return this.addError(
          ERRORS.BAD_DATA,
          "Template " + ERROR_MSG.NOT_EXISTS
        );
      }

      if (
        checkTemplateExists.isPrimary === EMAIL_TEMPLATE_PRIMARY_STATUS.PRIMARY
      ) {
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.PRIMARY_TEMPLATE_ERROR);
      }

      await db.EmailTemplate.update(
        { isPrimary: EMAIL_TEMPLATE_PRIMARY_STATUS.DISABLE },
        { where: { ...query, type } }
      );

      const emailTemplate = await checkTemplateExists
        .set({ isPrimary: EMAIL_TEMPLATE_PRIMARY_STATUS.PRIMARY })
        .save();

      return { emailTemplate };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
