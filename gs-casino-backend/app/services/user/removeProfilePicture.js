import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { removeLogo } from "../../utils/common";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import config from "../../../config/app";

const constraints = {
  user: {
    presence: { allowEmpty: false },
  },
};

export class RemoveProfileImageService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { user } = this.filteredArgs;

    try {
      if (!user.profileImage)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      const profileImageName = user.profileImage.split(/[.-]+/);
      const profileImageType = profileImageName.pop();

      const key = `${config.get("env")}/user_profile_image/${
        user.userId
      }-${profileImageName.pop()}.${profileImageType}`;

      await removeLogo(key);

      await user.set({ profileImage: null }).save();

      return { success: true, message: SUCCESS_MSG.REMOVE_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
