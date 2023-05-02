import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { updateEntity, getOne } from "../helper/crud";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  cmsPageId: {
    type: "integer",
    presence: { allowEmpty: false },
  },
  title: {
    presence: { allowEmpty: false },
  },
  slug: {
    format: {
      pattern: "^[a-zA-Z0-9-_#]*$",
      flags: "i",
      message: "can only contain A-Z, 0-9 and special characters like -, _, #",
    },
    presence: { allowEmpty: false },
  },
  content: {
    presence: { allowEmpty: false },
  },
  category: {
    presence: { allowEmpty: false },
  },
  isActive: {
    type: "boolean",
    presence: false,
  },
  language: {
    presence: { allowEmpty: false },
  },
};

export class UpdateCmsPageService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { cmsPageId, title, slug, content, isActive, category, language } =
      this.filteredArgs;

    const t = await db.sequelize.transaction();

    try {
      const checkCmsExist = await getOne({
        model: db.CmsPage,
        data: { cmsPageId },
      });

      if (!checkCmsExist)
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.NOT_FOUND);

      const checkCmsSlugExist = await getOne({
        model: db.CmsPage,
        data: { slug },
      });

      if (checkCmsSlugExist && checkCmsSlugExist.cmsPageId !== cmsPageId) {
        return this.addError(ERRORS.BAD_DATA, "CMS slug " + ERROR_MSG.EXISTS);
      }

      const newTitle = checkCmsExist.title;
      const newContent = checkCmsExist.content;
      newTitle[language] = title;
      newContent[language] = content;

      const updateCmsPage = await updateEntity({
        model: db.CmsPage,
        data: {
          slug,
          isActive,
          category,
          title: newTitle,
          content: newContent,
        },
        values: { cmsPageId },
        transaction: t,
      });

      await t.commit();

      return { updateCmsPage, message: SUCCESS_MSG.UPDATE_SUCCESS };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
