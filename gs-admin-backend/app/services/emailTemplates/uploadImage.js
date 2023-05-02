import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { updateEntity, createNewEntity } from "../helper/crud";
import { ERRORS } from "../../utils/errors";
import { uploadLogo } from "../../utils/common";
import { ROLE } from "../../utils/constant";

const constraints = {
  userType: {
    presence: { allowEmpty: false },
  },
  image: {
    presence: { allowEmpty: false },
  },
  name: {
    presence: { allowEmpty: false },
  },
};

export class UploadImageGalleryService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { userType, image, name } = this.filteredArgs;

    try {
      let imageUrl;

      if (image && typeof image === "object") {
        let fileName;
        if (userType === ROLE.SUPERADMIN) {
          fileName = `${
            process.env.NODE_ENV
          }/superadmin_gallery_image_${Math.random()
            .toString(36)
            .substring(2, 15)}-${Date.now()}.${image.mimetype.split("/")[1]}`;
        }

        const s3Object = await uploadLogo(image, fileName);
        imageUrl = s3Object.Location;
      }

      let gallery;

      if (userType === ROLE.SUPERADMIN) {
        const superadminGallery = JSON.parse(
          (
            await db.GlobalSetting.findOne({
              attributes: ["key", "value"],
              where: { key: "SUPERADMIN_GALLERY" },
              raw: true,
            })
          ).value
        );

        superadminGallery.push({
          name,
          imageUrl,
        });

        gallery = superadminGallery;

        await updateEntity({
          model: db.GlobalSetting,
          values: { key: "SUPERADMIN_GALLERY" },
          data: { value: JSON.stringify(superadminGallery) },
        });
      }
      return { gallery, message: SUCCESS_MSG.UPDATE_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
