import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { getOne } from "../helper/crud";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  id: {
    presence: { allowEmpty: false },
  },
  user: {
    presence: { allowEmpty: false },
  },
  timeLimit: {
    presence: { allowEmpty: false },
  },
  reset: {
    presence: false,
  },
  password: {
    presence: { allowEmpty: false },
  },
};

export class SetTimeLimitService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { id, timeLimit, reset } = this.filteredArgs;

    try {
      const userLimits = await getOne({
        model: db.Limit,
        data: { userId: id },
      });

      if (
        userLimits.timeLimit &&
        new Date(userLimits.timeLimitExpiry) >= new Date()
      ) {
        return this.addError(
          ERRORS.BAD_REQUEST,
          ERROR_MSG.UPDATE_DAILY_LIMIT + `${userLimits.timeLimitExpiry}`
        );
      }
      if (reset) {
        await userLimits
          .set({
            timeLimit: null,
            timeLimitExpiry: null,
            timeLimitUpdatedAt: new Date(),
          })
          .save();
        return { reset: true, limit: userLimits };
      }

      if (timeLimit > 24 || timeLimit < 1)
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.TIME_LIMIT_ERROR);

      const now = new Date();
      now.setDate(now.getDate() + 1);

      await userLimits
        .set({
          timeLimit,
          timeLimitExpiry: now,
          timeLimitUpdatedAt: new Date(),
        })
        .save();

      return {
        limit: userLimits,
        message: SUCCESS_MSG.UPDATE_SUCCESS,
      };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
