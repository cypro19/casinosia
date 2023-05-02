import db from "../../db/models";
import { updateEntity } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { comparePassword } from "../../utils/common";
import { BREAK_TYPE, SELF_EXCLUSION_TYPE } from "../../utils/constant";
import { APP_ERROR_CODES, ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  id: {
    presence: { allowEmpty: false },
  },
  user: {
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
  password: {
    presence: { allowEmpty: false },
  },
};

export class SetDisableUntilService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let { id, user, type, days, password } = this.filteredArgs;

    const disableUntil = user.selfExclusion;

    let timeStamp, isSelfExclusionPermanent;

    try {
      if (!(await comparePassword(password, user.password)))
        return this.addError(
          ERRORS.BAD_REQUEST,
          APP_ERROR_CODES.INCORRECT_PASSWORD
        );

      if (disableUntil && new Date(disableUntil) >= new Date())
        return this.addError(
          ERRORS.BAD_DATA,
          ERROR_MSG.USER_DISABLE_UNTIL + `${new Date(disableUntil).toString()}`
        );

      if (!type) type = BREAK_TYPE.TAKE_A_BREAK;

      if (type === BREAK_TYPE.TAKE_A_BREAK) {
        if (days <= 0 || days > 30)
          return this.addError(
            ERRORS.BAD_DATA,
            ERROR_MSG.TAKE_A_BREAK_DAY_ERROR
          );

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
          values: { userId: id },
        });
      } else if (type === BREAK_TYPE.SELF_EXCLUSION) {
        updateDisableUntil = await updateEntity({
          model: db.Limit,
          data: {
            selfExclusion: timeStamp,
            isSelfExclusionPermanent,
            selfExclusionType: SELF_EXCLUSION_TYPE.CURRENT,
            selfExclusionUpdatedAt: new Date(),
          },
          values: { userId: id },
        });
      }

      return { updateDisableUntil, message: SUCCESS_MSG.UPDATE_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
