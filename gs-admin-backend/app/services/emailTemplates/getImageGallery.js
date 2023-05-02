import db from "../../db/models";
import { ROLE } from "../../utils/constant";
import ServiceBase from "../../common/serviceBase";
import { ERRORS } from "../../utils/errors";

const constraints = {
  userType: {
    presence: { allowEmpty: false },
  },
};

export class GetGalleryService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { userType } = this.filteredArgs;

    try {
      let gallery = [];

      if (userType === ROLE.SUPERADMIN) {
        gallery = JSON.parse(
          (
            await db.GlobalSetting.findOne({
              attributes: ["key", "value"],
              where: { key: "SUPERADMIN_GALLERY" },
              raw: true,
            })
          ).value
        );
      }

      return { gallery };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
