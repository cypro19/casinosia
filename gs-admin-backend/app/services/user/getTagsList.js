import db from "../../db/models";
import { getOne } from "../helper/crud";
import { ERRORS } from "../../utils/errors";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";

const constraints = {
  id: {
    presence: { allowEmpty: false },
  },
  user: {
    presence: { allowEmpty: false },
  },
};

export class GetTagsService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { id, user } = this.filteredArgs;
    let query = { key: "TAGS", adminUserId: id };

    try {
      if (user.adminRoleId !== 1)
        query = { ...query, adminUserId: user.parentId };

      const tags = await getOne({
        model: db.AdminUserSetting,
        data: query,
        attributes: ["value"],
      });

      return { tags, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
