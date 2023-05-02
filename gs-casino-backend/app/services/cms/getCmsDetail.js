import db from "../../db/models";
import { getOne } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { DEFAULT_LANGUAGE } from "../../utils/constant";
import {
  getDynamicDataValue,
  insertDynamicDataInCmsTemplate,
} from "../helper/email";

const constraints = {
  cmsPageId: {
    presence: { allowEmpty: false },
  },
  language: {
    presence: { allowEmpty: false },
  },
};

export class GetCmsPageService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let { cmsPageId, language } = this.filteredArgs;

    try {
      const query = { cmsPageId };

      const cmsDetails = await getOne({ model: db.CmsPage, data: query });

      if (!cmsDetails)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);
      if (!cmsDetails.content[language]) language = DEFAULT_LANGUAGE;

      cmsDetails.content = insertDynamicDataInCmsTemplate({
        template: cmsDetails.content[language],
        dynamicData: await getDynamicDataValue(),
      });

      return { cmsDetails, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
