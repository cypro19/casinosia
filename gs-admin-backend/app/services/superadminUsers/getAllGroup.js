import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  group: {
    presence: false,
  },
};

export class GetAllGroupService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { group } = this.filteredArgs;

    try {
      let groupNames;
      if (group !== null) {
        groupNames = await db.SuperAdminUser.findAll({
          attributes: ["group"],
          group: ["group"],
          order: [["group", "ASC"]],
        });
      }
      if (!groupNames)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      const responseList = [];
      groupNames.forEach((group) => {
        responseList.push(group.group);
      });
      return { groupNames: responseList, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
