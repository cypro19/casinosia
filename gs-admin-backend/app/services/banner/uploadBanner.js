import db from "../../db/models";
import { ROLE } from "../../utils/constant";
import { updateEntity } from "../helper/crud";
import { uploadLogo } from "../../utils/common";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  userType: {
    presence: { allowEmpty: false },
  },
  image: {
    presence: { allowEmpty: false },
  },
  bannerKey: {
    presence: { allowEmpty: false },
  },
};

export class UploadBannerService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { userType, image, bannerKey } = this.filteredArgs;

    try {
      if (!bannerKey)
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.bANNER_KEY_REQUIRED);
      let banner;
      if (userType === ROLE.SUPERADMIN) {
        banner = await db.GlobalSetting.findOne({
          attributes: ["value"],
          raw: true,
          where: { key: "BANNER" },
        });

        if (!banner)
          return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);
        const result = JSON.parse(banner.value);
        if (image && typeof image === "object") {
          let fileName;
          if (userType === ROLE.SUPERADMIN) {
            fileName = `${
              process.env.NODE_ENV
            }/admin_banner_image_${Math.random()
              .toString(36)
              .substring(2, 15)}-${Date.now()}.${image.mimetype.split("/")[1]}`;
          }

          const s3Object = await uploadLogo(image, fileName);
          result[bannerKey] = s3Object.Location;
        }

        await updateEntity({
          model: db.GlobalSetting,
          values: { key: "BANNER" },
          data: { value: JSON.stringify(result) },
        });
      }
      var resultSent = true; //{banner:result[bannerKey]}
      return { resultSent, message: SUCCESS_MSG.UPDATE_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
