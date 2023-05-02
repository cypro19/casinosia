import db from "../../db/models";
import { ROLE } from "../../utils/constant";
import ServiceBase from "../../common/serviceBase";
import { ERRORS } from "../../utils/errors";
import { getKey, removeByAttr, removeLogo } from "../../utils/common";
import { deleteEntity, updateEntity } from "../helper/crud";

const constraints = {
  imageUrl: {
    presence: false,
  },
  userType: {
    presence: { allowEmpty: false },
  },
};

export class DeleteImageFromGalleryService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { imageId, userType, imageUrl } = this.filteredArgs;

    try {
      let success = false;
      let message = "Unable to delete image from gallery";

      if (userType === ROLE.SUPERADMIN) {
        const gallery = JSON.parse(
          (
            await db.GlobalSetting.findOne({
              attributes: ["key", "value"],
              where: { key: "SUPERADMIN_GALLERY" },
              raw: true,
            })
          ).value
        );

        await removeLogo(getKey(imageUrl));

        const newGallery = removeByAttr(gallery, "imageUrl", imageUrl);

        await updateEntity({
          model: db.GlobalSetting,
          values: { key: "SUPERADMIN_GALLERY" },
          data: { value: JSON.stringify(newGallery) },
        });

        success = true;
        message = "Image deleted from gallery";
      }

      return { success, message };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
