import db from "../../db/models";
import { getOne } from "../helper/crud";
import { ROLE } from "../../utils/constant";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  cmsPageId: {
    format: {
      pattern: "^[0-9]+$",
      flags: "i",
      message: "can only be Integer.",
    },
    presence: { allowEmpty: false },
  },
  userType: {
    presence: { allowEmpty: false },
  },
  user: {
    presence: false,
  },
};

export class GetCmsPageService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { cmsPageId, userType, user } = this.filteredArgs;

    try {
      let query = { cmsPageId };

      if (userType === ROLE.ADMIN && user) query = { ...query };

      const cmsDetails = await getOne({ model: db.CmsPage, data: query });

      if (!cmsDetails)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { cmsDetails, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
