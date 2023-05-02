import db from "../../db/models";
import { getAll } from "../helper/crud";
import { ROLE } from "../../utils/constant";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { pageValidation } from "../../utils/common";
import { Op } from "sequelize";

const constraints = {
  limit: {
    presence: false,
  },
  pageNo: {
    presence: false,
  },
  userType: {
    presence: { allowEmpty: false },
  },
  adminId: {
    presence: false,
  },
  user: {
    presence: false,
  },
  isActive: {
    inclusion: {
      within: ["true", "false", "", null],
      message: "can be true or false",
    },
    presence: false,
  },
  search: {
    presence: false,
  },
  language: {
    presence: false,
  },
};

export class GetAllCmsPageService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let query;
    let { limit, pageNo, search, language, isActive } = this.filteredArgs;

    try {
      const { page, size } = pageValidation(pageNo, limit);

      if (search) {
        if (!language) language = "EN";

        query = {
          ...query,
          [Op.or]: [
            { title: { [`${language}`]: { [Op.iLike]: `%${search}%` } } },
            { slug: { [Op.iLike]: `%${search}%` } },
            { content: { [`${language}`]: { [Op.iLike]: `%${search}%` } } },
          ],
        };
      }
      if (isActive && (isActive !== "" || isActive !== null))
        query = { ...query, isActive };

      const cmsPages = await db.CmsPage.findAndCountAll({
        where: query,
        order: [["createdAt", "DESC"]],
        limit: size,
        offset: (page - 1) * size,
      });

      if (!cmsPages)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { cmsPages, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
