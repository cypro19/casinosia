import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { getOne } from "../helper/crud";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { ROLE } from "../../utils/constant";

const constraints = {
  userType: {
    presence: { allowEmpty: false },
  },
  userId: {
    presence: { allowEmpty: false },
  },
  timeLimit: {
    presence: { allowEmpty: false },
  },
  reset: {
    presence: false,
  },
};

export class SetTimeLimitService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { userType, userId, timeLimit, reset } = this.filteredArgs;

    try {
      let user;

      if (userType === ROLE.SUPERADMIN) {
        user = await getOne({
          model: db.User,
          data: { userId },
        });
      } else if (userType === ROLE.ADMIN) {
        user = await getOne({
          model: db.User,
          data: { userId },
        });
      }

      if (!user) return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      if (reset) {
        await db.Limit.update(
          {
            timeLimit: null,
            timeLimitExpiry: null,
            timeLimitUpdatedAt: new Date(),
          },
          { where: { userId } }
        );
        return { reset: true };
      }

      if (timeLimit > 24 || timeLimit < 1) {
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.TIME_LIMIT_ERROR);
      }

      const now = new Date();
      now.setDate(now.getDate() + 1);

      await db.Limit.update(
        { timeLimit, timeLimitExpiry: now, timeLimitUpdatedAt: new Date() },
        { where: { userId } }
      );

      const newLimits = await getOne({
        model: db.Limit,
        data: { userId },
      });

      return { limit: newLimits, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
