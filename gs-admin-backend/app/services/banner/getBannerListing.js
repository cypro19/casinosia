import db from "../../db/models";
import { Op } from "sequelize";
import { ROLE } from "../../utils/constant";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { pageValidation } from "../../utils/common";

const constraints = {
  userType: {
    presence: false,
  },
  limit: {
    presence: false,
  },
  pageNo: {
    presence: false,
  },
};

export class GetBannerService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { userType, limit, pageNo } = this.filteredArgs;

    try {
      let banners;
      const { page, size } = pageValidation(pageNo, limit);

      if (userType === ROLE.SUPERADMIN) {
        banners = await db.GlobalSetting.findAll({
          attributes: ["value"],
          limit: size,
          offset: (page - 1) * size,
          raw: true,
          where: { key: "BANNER" },
        });
      }
      if (banners[0].value !== "") {
        banners = JSON.parse(banners[0].value);
      }
      return { banners };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
