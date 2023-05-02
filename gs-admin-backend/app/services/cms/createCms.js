import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { createNewEntity, getAll, getOne, updateEntity } from "../helper/crud";

const constraints = {
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

export class CreateCmsPageService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { title, slug, content, isActive, category, language } =
      this.filteredArgs;
    const t = await db.sequelize.transaction();
    try {
      const newTitle = {};
      const newContent = {};
      newTitle[language] = title;
      newContent[language] = content;
      const checkCmsExist = await getOne({
        model: db.CmsPage,
        data: { slug },
      });

      if (checkCmsExist)
        return this.addError(ERRORS.BAD_DATA, "Slug " + ERROR_MSG.EXISTS);

      await createNewEntity({
        model: db.CmsPage,
        data: {
          title: newTitle,
          slug,
          content: newContent,
          isActive,
          category,
        },
        transaction: t,
      });

      await t.commit();

      return { success: true, message: SUCCESS_MSG.CREATE_SUCCESS };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
