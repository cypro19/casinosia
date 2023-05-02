import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import { getAll, getOne } from "../helper/crud";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { ROLE } from "../../utils/constant";

const constraints = {
  userId: {
    presence: { allowEmpty: false },
  },
  user: {
    presence: false,
  },
  userType: {
    presence: { allowEmpty: false },
  },
};

export class GetUserDocumentService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { userId, user, userType } = this.filteredArgs;

    try {
      let query = { userId };

      const userExist = await getOne({ model: db.User, data: query });

      if (!userExist)
        return this.addError(ERRORS.BAD_DATA, "User " + ERROR_MSG.NOT_EXISTS);

      const userDocument = await getAll({
        model: db.UserDocument,
        data: { userId: userExist.userId },
        order: [["createdAt", "ASC"]],
      });

      if (!userDocument)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { userDocument, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
