import db from "../../db/models";
import { ROLE } from "../../utils/constant";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { getOne } from "../helper/crud";

const constraints = {
  userType: {
    presence: { allowEmpty: false },
  },
  cmsPageId: {
    presence: { allowEmpty: false },
  },
  language: {
    presence: { allowEmpty: false },
  },
};

export class DeleteCmsLanguageService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { userType, cmsPageId, language } = this.filteredArgs;

    try {
      let query;

      if (userType === ROLE.ADMIN) {
        query = { cmsPageId };
      } else if (userType === ROLE.SUPERADMIN) {
        query = { cmsPageId };
      }

      const cmsPage = await getOne({
        model: db.CmsPage,
        data: query,
      });

      if (!cmsPage) return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      if (language === "EN") {
        return this.addError(ERRORS.BAD_REQUEST, ERROR_MSG.NOT_ALLOWED);
      }

      delete cmsPage.title[language];
      delete cmsPage.content[language];

      await cmsPage.set({ title: cmsPage.title }).save();
      await cmsPage.set({ content: cmsPage.content }).save();

      return { success: true };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
