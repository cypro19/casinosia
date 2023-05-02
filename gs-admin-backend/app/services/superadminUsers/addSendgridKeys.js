import db from "../../db/models";
import ServiceBase from "../../common/serviceBase";
import { updateEntity } from "../helper/crud";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { ROLE } from "../../utils/constant";
import { encodeCredential } from "../../utils/common";

const constraints = {
  userType: {
    presence: { allowEmpty: false },
  },
  user: {
    presence: { allowEmpty: false },
  },
  sendgridKey: {
    presence: { allowEmpty: false },
  },
  sendgridEmail: {
    presence: { allowEmpty: false },
  },
};

export class SetSendgridCredentialsService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { sendgridEmail, sendgridKey, user, userType } = this.filteredArgs;

    try {
      if (userType !== ROLE.SUPERADMIN || user.superRoleId !== 1) {
        return this.addError(ERRORS.FORBIDDEN, ERROR_MSG.NOT_ALLOWED);
      }

      await updateEntity({
        model: db.GlobalSetting,
        data: {
          value: encodeCredential(
            Buffer.from(sendgridEmail, "base64").toString("ascii")
          ),
        },
        values: { key: "SENDGRID_EMAIL" },
      });

      await updateEntity({
        model: db.GlobalSetting,
        data: {
          value: encodeCredential(
            Buffer.from(sendgridKey, "base64").toString("ascii")
          ),
        },
        values: { key: "SENDGRID_API_KEY" },
      });

      return { success: true };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
