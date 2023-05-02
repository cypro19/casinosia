import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { ROLE } from "../../utils/constant";
import {
  sendMailRaw,
  getSendGridCredentials,
  insertDynamicDataInTemplate,
} from "../helper/email";

const constraints = {
  userType: {
    presence: { allowEmpty: false },
  },
  templateCode: {
    presence: { allowEmpty: false },
  },
  testEmail: {
    presence: { allowEmpty: false },
  },
  dynamicData: {
    presence: { allowEmpty: false },
  },
};

export class TestEmailTemplateService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { userType, templateCode, testEmail, dynamicData } =
      this.filteredArgs;

    try {
      let credentials;

      if (userType === ROLE.SUPERADMIN) {
        credentials = await getSendGridCredentials();
      }

      if (Object.keys(credentials).length !== 2) {
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.CREDENTIALS_NOT_FOUND);
      }

      const emailBodyRaw = insertDynamicDataInTemplate({
        template: Buffer.from(templateCode, "BASE64").toString("utf8"),
        dynamicData,
      });

      const emailSent = await sendMailRaw({
        email: testEmail,
        credentials,
        dataValues: dynamicData,
        templateCode: emailBodyRaw,
        successMsg: "Email Sent",
      });

      return { emailSent };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
