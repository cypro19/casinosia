import db from "../../db/models";
import { ROLE } from "../../utils/constant";
import { uploadLogo } from "../../utils/common";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { updateEntity, getOne } from "../helper/crud";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  image: {
    presence: { allowEmpty: false },
  },
  userType: {
    presence: { allowEmpty: false },
  },
  bannerKey: {
    presence: { allowEmpty: false },
  },
};

export class UpdateBannerPageService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { image, userType, bannerKey } = this.filteredArgs;

    try {
      if (!bannerKey)
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.bANNER_KEY_REQUIRED);

      const checkBannerExist = await db.GlobalSetting.findOne({
        attributes: ["value"],
        raw: true,
        where: { key: "BANNER" },
      });

      if (!checkBannerExist || !checkBannerExist.value)
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.NOT_FOUND);
      const result = JSON.parse(checkBannerExist.value);

      if (image && typeof image === "object") {
        let fileName;
        if (userType === ROLE.SUPERADMIN) {
          fileName = `${process.env.NODE_ENV}/admin_banner_image_${Math.random()
            .toString(36)
            .substring(2, 15)}-${Date.now()}.${image.mimetype.split("/")[1]}`;
        }
        const s3Object = await uploadLogo(image, fileName);
        result[bannerKey] = s3Object.Location;
      }

      const updateBanner = await updateEntity({
        model: db.GlobalSetting,
        values: { key: "BANNER" },
        data: {
          value: JSON.stringify(result),
        },
      });

      return { updateBanner, message: SUCCESS_MSG.UPDATE_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
