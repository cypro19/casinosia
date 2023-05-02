import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  id: {
    presence: { allowEmpty: false },
  },
};

export class GetUserDocumentService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { id } = this.filteredArgs;

    try {
      const userDocument = await db.UserDocument.findAndCountAll({
        where: { userId: id },
      });

      if (!userDocument)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { userDocument, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
