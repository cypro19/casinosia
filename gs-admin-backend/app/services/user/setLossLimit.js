import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { getOne } from "../helper/crud";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { LIMIT_TIME_PERIOD, ROLE } from "../../utils/constant";

const constraints = {
  userType: {
    presence: { allowEmpty: false },
  },
  userId: {
    presence: { allowEmpty: false },
  },
  lossLimit: {
    presence: { allowEmpty: false },
  },
  timePeriod: {
    inclusion: {
      within: ["daily", "weekly", "monthly"],
      message: "can only be daily, weekly or monthly",
    },
    presence: { allowEmpty: false },
  },
  reset: {
    presence: false,
  },
};

export class SetLossLimitService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { userId, lossLimit, timePeriod, reset, userType } =
      this.filteredArgs;

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

      const userLimits = await getOne({
        model: db.Limit,
        data: { userId },
      });

      let limit = userLimits.dataValues;

      if (timePeriod === LIMIT_TIME_PERIOD.DAILY) {
        if (reset) {
          return {
            limit: await userLimits
              .set({
                dailyLossLimit: null,
                dailyLossExpiry: null,
                dailyLossUpdatedAt: new Date(),
              })
              .save(),
          };
        }
        if (
          userLimits.weeklyLossLimit &&
          lossLimit > userLimits.weeklyLossLimit
        ) {
          return this.addError(
            ERRORS.BAD_REQUEST,
            "Daily loss limit should be less than or equal to weekly loss limit"
          );
        }
        if (
          userLimits.monthlyLossLimit &&
          lossLimit > userLimits.monthlyLossLimit
        ) {
          return this.addError(
            ERRORS.BAD_REQUEST,
            "Daily loss limit should be less than monthly loss limit"
          );
        }

        const now = new Date();
        now.setDate(now.getDate() + 1);

        limit = await userLimits
          .set({
            dailyLossLimit: lossLimit,
            dailyLossExpiry: now,
            dailyLossUpdatedAt: new Date(),
          })
          .save();
      } else if (timePeriod === LIMIT_TIME_PERIOD.WEEKLY) {
        if (reset) {
          return {
            limit: await userLimits
              .set({
                weeklyLossLimit: null,
                weeklyLossExpiry: null,
                weeklyLossUpdatedAt: new Date(),
              })
              .save(),
          };
        }
        if (
          userLimits.dailyLossLimit &&
          lossLimit < userLimits.dailyLossLimit
        ) {
          return this.addError(
            ERRORS.BAD_REQUEST,
            "Weekly loss limit should be greater than daily loss limit"
          );
        }
        if (
          userLimits.monthlyLossLimit &&
          lossLimit > userLimits.monthlyLossLimit
        ) {
          return this.addError(
            ERRORS.BAD_REQUEST,
            "Weekly loss limit should be less than monthly loss limit"
          );
        }

        const now = new Date();
        now.setDate(now.getDate() + 1);

        limit = await userLimits
          .set({
            weeklyLossLimit: lossLimit,
            weeklyLossExpiry: now,
            weeklyLossUpdatedAt: new Date(),
          })
          .save();
      } else if (timePeriod === LIMIT_TIME_PERIOD.MONTHLY) {
        if (reset) {
          return {
            limit: await userLimits
              .set({
                monthlyLossLimit: null,
                monthlyLossExpiry: null,
                monthlyLossUpdatedAt: new Date(),
              })
              .save(),
          };
        }
        if (
          userLimits.dailyLossLimit &&
          lossLimit < userLimits.dailyLossLimit
        ) {
          return this.addError(
            ERRORS.BAD_REQUEST,
            "Monthly loss limit should be greater than daily loss limit"
          );
        }
        if (
          userLimits.weeklyLossLimit &&
          lossLimit < userLimits.weeklyLossLimit
        ) {
          return this.addError(
            ERRORS.BAD_REQUEST,
            "Monthly loss limit should be greater than weekly loss limit"
          );
        }

        const now = new Date();
        now.setDate(now.getDate() + 1);

        limit = await userLimits
          .set({
            monthlyLossLimit: lossLimit,
            monthlyLossExpiry: now,
            monthlyLossUpdatedAt: new Date(),
          })
          .save();
      }

      return { limit, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
