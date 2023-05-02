import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { getOne, createNewEntity } from "../helper/crud";

const constraints = {
  uniqueKey: {
    presence: { allowNull: false },
  },
};

export class InsertUniqueUserKeyService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { uniqueKey } = this.filteredArgs;

    try {
      const checkKeyExists = await getOne({
        model: db.UniqueUserIdentification,
        data: { uniqueKey },
      });

      if (checkKeyExists) {
        return { success: false, message: ERROR_MSG.UNIQUE_KEY_EXISTS };
      }

      await createNewEntity({
        model: db.UniqueUserIdentification,
        data: { uniqueKey },
      });

      return { success: true, message: SUCCESS_MSG.CREATE_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
