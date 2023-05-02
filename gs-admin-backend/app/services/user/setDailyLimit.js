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
  dailyLimit: {
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

export class SetDailyLimitService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { userId, dailyLimit, timePeriod, reset, userType } =
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
                dailyBetLimit: null,
                dailyBetExpiry: null,
                dailyBetUpdatedAt: new Date(),
              })
              .save(),
          };
        }
        if (
          userLimits.weeklyBetLimit &&
          dailyLimit > userLimits.weeklyBetLimit
        ) {
          return this.addError(
            ERRORS.BAD_REQUEST,
            "Daily bet limit should be less than or equal to weekly bet limit"
          );
        }
        if (
          userLimits.monthlyBetLimit &&
          dailyLimit > userLimits.monthlyBetLimit
        ) {
          return this.addError(
            ERRORS.BAD_REQUEST,
            "Daily bet limit should be less than monthly bet limit"
          );
        }

        const now = new Date();
        now.setDate(now.getDate() + 1);

        limit = await userLimits
          .set({
            dailyBetLimit: dailyLimit,
            dailyBetExpiry: now,
            dailyBetUpdatedAt: new Date(),
          })
          .save();
      } else if (timePeriod === LIMIT_TIME_PERIOD.WEEKLY) {
        if (reset) {
          return {
            limit: await userLimits
              .set({
                weeklyBetLimit: null,
                weeklyBetExpiry: null,
                weeklyBetUpdatedAt: new Date(),
              })
              .save(),
          };
        }
        if (userLimits.dailyBetLimit && dailyLimit < userLimits.dailyBetLimit) {
          return this.addError(
            ERRORS.BAD_REQUEST,
            "Weekly bet limit should be greater than daily bet limit"
          );
        }
        if (
          userLimits.monthlyBetLimit &&
          dailyLimit > userLimits.monthlyBetLimit
        ) {
          return this.addError(
            ERRORS.BAD_REQUEST,
            "Weekly bet limit should be less than monthly bet limit"
          );
        }

        const now = new Date();
        now.setDate(now.getDate() + 1);

        limit = await userLimits
          .set({
            weeklyBetLimit: dailyLimit,
            weeklyBetExpiry: now,
            weeklyBetUpdatedAt: new Date(),
          })
          .save();
      } else if (timePeriod === LIMIT_TIME_PERIOD.MONTHLY) {
        if (reset) {
          return {
            limit: await userLimits
              .set({
                monthlyBetLimit: null,
                monthlyBetExpiry: null,
                monthlyBetUpdatedAt: new Date(),
              })
              .save(),
          };
        }
        if (userLimits.dailyBetLimit && dailyLimit < userLimits.dailyBetLimit) {
          return this.addError(
            ERRORS.BAD_REQUEST,
            "Monthly bet limit should be greater than daily bet limit"
          );
        }
        if (
          userLimits.weeklyBetLimit &&
          dailyLimit < userLimits.weeklyBetLimit
        ) {
          return this.addError(
            ERRORS.BAD_REQUEST,
            "Monthly bet limit should be greater than weekly bet limit"
          );
        }

        const now = new Date();
        now.setDate(now.getDate() + 1);

        limit = await userLimits
          .set({
            monthlyBetLimit: dailyLimit,
            monthlyBetExpiry: now,
            monthlyBetUpdatedAt: new Date(),
          })
          .save();
      }

      return { limit, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
