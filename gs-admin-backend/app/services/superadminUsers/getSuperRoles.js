import db from "../../db/models";
import { getAll } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

export class GetSuperRolesService extends ServiceBase {
  async run() {
    try {
      const roles = await getAll({ model: db.SuperadminRole });

      if (!roles) return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { roles, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
