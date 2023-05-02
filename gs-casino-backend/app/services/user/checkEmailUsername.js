import db from "../../db/models";
import { getOne } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  email: {
    presence: false,
  },
  username: {
    presence: false,
  },
};

export class CheckUniqueEmailUsername extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let { email, username } = this.filteredArgs;

    try {
      if (email) {
        email = email.toLowerCase();

        const emailCheck = await getOne({
          model: db.User,
          data: { email },
          attributes: ["email"],
        });

        if (emailCheck)
          return this.addError(ERRORS.BAD_DATA, ERROR_MSG.EMAIL_EXIST);
      }

      if (username) {
        const usernameCheck = await getOne({
          model: db.User,
          data: { username },
          attributes: ["username"],
        });

        if (usernameCheck)
          return this.addError(ERRORS.BAD_DATA, ERROR_MSG.USERNAME_EXIST);
      }

      return { checkUniqueConstraint: true, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
