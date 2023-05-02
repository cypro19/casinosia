import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { getOne } from "../helper/crud";

export class GetGameCategoryService extends ServiceBase {
  async run() {
    try {
      const casinoCategories = await db.MasterGameCategory.findAndCountAll({
        where: { isActive: true },
        order: [["orderId"]],
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      if (!casinoCategories)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      const cmsList = await db.CmsPage.findAndCountAll({
        where: { isActive: true },
        order: [["slug", "ASC"]],
        attributes: ["cmsPageId", "slug", "title", "isActive", "category"],
      });

      const bannerList = JSON.parse(
        (
          await getOne({
            model: db.GlobalSetting,
            data: { key: "BANNER" },
            raw: true,
          })
        ).value || "{}"
      );

      return {
        casinoCategories,
        cmsList,
        bannerUrl: bannerList,
        message: SUCCESS_MSG.GET_SUCCESS,
      };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
