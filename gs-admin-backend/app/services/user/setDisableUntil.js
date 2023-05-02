import db from "../../db/models";
import { getOne, updateEntity } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { BREAK_TYPE, ROLE, SELF_EXCLUSION_TYPE } from "../../utils/constant";
import { getAllPortalUserIds } from "../../utils/common";

const constraints = {
  userType: {
    presence: { allowEmpty: false },
  },
  userId: {
    presence: { allowEmpty: false },
  },
  type: {
    inclusion: {
      within: ["TAKE_A_BREAK", "SELF_EXCLUSION"],
      message: "can be 'TAKE_A_BREAK', 'SELF_EXCLUSION'",
    },
    presence: { allowEmpty: false },
  },
  days: {
    type: "integer",
    presence: false,
  },
  reset: {
    presence: false,
  },
};

export class SetDisableUntilService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let { userId, type, days, reset, userType } = this.filteredArgs;

    try {
      let userDetail;

      if (userType === ROLE.SUPERADMIN) {
        userDetail = await getOne({
          model: db.User,
          data: { userId },
        });
      } else if (userType === ROLE.ADMIN) {
        userDetail = await getOne({
          model: db.User,
          data: { userId },
        });
      }

      if (!userDetail)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      if (reset && type === BREAK_TYPE.TAKE_A_BREAK) {
        return {
          updateDisableUntil: await userDetail
            .set({ selfExclusion: null, selfExclusionUpdatedAt: new Date() })
            .save(),
        };
      }

      if (reset && type === BREAK_TYPE.SELF_EXCLUSION) {
        return {
          updateDisableUntil: await updateEntity({
            model: db.Limit,
            data: {
              selfExclusion: null,
              isSelfExclusionPermanent: null,
              selfExclusionType: null,
              selfExclusionUpdatedAt: new Date(),
            },
            values: { userId },
          }),
        };
      }

      let timeStamp, isSelfExclusionPermanent;

      if (!type) {
        type = BREAK_TYPE.TAKE_A_BREAK;
      }

      if (type === BREAK_TYPE.TAKE_A_BREAK) {
        if (days <= 0 || days > 30) {
          return this.addError(
            ERRORS.BAD_DATA,
            ERROR_MSG.TAKE_A_BREAK_DAY_ERROR
          );
        }
        const now = new Date();
        now.setDate(now.getDate() + days);
        timeStamp = now;
      } else if (type === BREAK_TYPE.SELF_EXCLUSION) {
        if (days === -1) {
          timeStamp = null;
          isSelfExclusionPermanent = true;
        } else {
          const now = new Date();
          now.setDate(now.getDate() + days);
          timeStamp = now;
          isSelfExclusionPermanent = false;
        }
      }

      let updateDisableUntil;

      if (type === BREAK_TYPE.TAKE_A_BREAK) {
        updateDisableUntil = await updateEntity({
          model: db.User,
          data: {
            selfExclusion: timeStamp,
            selfExclusionUpdatedAt: new Date(),
          },
          values: { userId },
        });
      } else if (type === BREAK_TYPE.SELF_EXCLUSION) {
        updateDisableUntil = await updateEntity({
          model: db.Limit,
          data: {
            selfExclusion: timeStamp,
            isSelfExclusionPermanent,
            selfExclusionUpdatedAt: new Date(),
          },
          values: { userId },
        });
      } else if (type === BREAK_TYPE.SELF_EXCLUSION) {
        const allPortalUserIds = await getAllPortalUserIds(userDetail.email);

        updateDisableUntil = await updateEntity({
          model: db.Limit,
          data: {
            selfExclusion: timeStamp,
            isSelfExclusionPermanent,
            selfExclusionUpdatedAt: new Date(),
          },
          values: { userId: allPortalUserIds },
        });
      }

      return { updateDisableUntil, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
