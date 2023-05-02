import config from "../../../config/app";
import { ERRORS } from "../../utils/errors";
import { uploadLogo } from "../../utils/common";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";

const constraints = {
  user: {
    presence: { allowEmpty: false },
  },
  profileImage: {
    presence: { allowEmpty: false },
  },
};

export class UploadProfileImageService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { user, profileImage } = this.filteredArgs;
    let key;

    try {
      if (user.profileImage) {
        const profileImageName = user.profileImage.split(/[.-]+/);
        const profileImageType = profileImageName.pop();

        key = `${config.get("env")}/user_profile_image/${
          user.userId
        }-${profileImageName.pop()}.${profileImageType}`;
      }

      const fileName = `${config.get("env")}/user_profile_image/${
        user.userId
      }-${Date.now()}.${profileImage.mimetype.split("/")[1]}`;

      const s3Object = await uploadLogo(profileImage, fileName, key);
      const data = { profileImage: s3Object.Location };

      await user.set(data).save();

      return { success: true, message: SUCCESS_MSG.UPLOAD_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
