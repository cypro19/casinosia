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
  depositLimit: {
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

export class SetDepositLimitService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { userId, depositLimit, timePeriod, reset, userType } =
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
                dailyDepositLimit: null,
                dailyDepositExpiry: null,
                dailyDepositUpdatedAt: new Date(),
              })
              .save(),
          };
        }
        if (
          userLimits.weeklyDepositLimit &&
          depositLimit > userLimits.weeklyDepositLimit
        ) {
          return this.addError(
            ERRORS.BAD_REQUEST,
            "Daily deposit limit should be less than or equal to weekly deposit limit"
          );
        }
        if (
          userLimits.monthlyDepositLimit &&
          depositLimit > userLimits.monthlyDepositLimit
        ) {
          return this.addError(
            ERRORS.BAD_REQUEST,
            "Daily deposit limit should be less than monthly deposit limit"
          );
        }

        const now = new Date();
        now.setDate(now.getDate() + 1);

        limit = await userLimits
          .set({
            dailyDepositLimit: depositLimit,
            dailyDepositExpiry: now,
            dailyDepositUpdatedAt: new Date(),
          })
          .save();
      } else if (timePeriod === LIMIT_TIME_PERIOD.WEEKLY) {
        if (reset) {
          return {
            limit: await userLimits
              .set({ weeklyDepositLimit: null, weeklyDepositExpiry: null })
              .save(),
          };
        }
        if (
          userLimits.dailyDepositLimit &&
          depositLimit < userLimits.dailyDepositLimit
        ) {
          return this.addError(
            ERRORS.BAD_REQUEST,
            "Weekly deposit limit should be greater than daily deposit limit"
          );
        }
        if (
          userLimits.monthlyDepositLimit &&
          depositLimit > userLimits.monthlyDepositLimit
        ) {
          return this.addError(
            ERRORS.BAD_REQUEST,
            "Weekly deposit limit should be less than monthly deposit limit"
          );
        }

        const now = new Date();
        now.setDate(now.getDate() + 1);

        limit = await userLimits
          .set({
            weeklyDepositLimit: depositLimit,
            weeklyDepositExpiry: now,
            weeklyDepositUpdatedAt: new Date(),
          })
          .save();
      } else if (timePeriod === LIMIT_TIME_PERIOD.MONTHLY) {
        if (reset) {
          return {
            limit: await userLimits
              .set({
                monthlyDepositLimit: null,
                monthlyDepositExpiry: null,
                monthlyDepositUpdatedAt: new Date(),
              })
              .save(),
          };
        }
        if (
          userLimits.dailyDepositLimit &&
          depositLimit < userLimits.dailyDepositLimit
        ) {
          return this.addError(
            ERRORS.BAD_REQUEST,
            "Monthly deposit limit should be greater than daily deposit limit"
          );
        }
        if (
          userLimits.weeklyDepositLimit &&
          depositLimit < userLimits.weeklyDepositLimit
        ) {
          return this.addError(
            ERRORS.BAD_REQUEST,
            "Monthly deposit limit should be greater than weekly deposit limit"
          );
        }

        const now = new Date();
        now.setDate(now.getDate() + 1);

        limit = await userLimits
          .set({
            monthlyDepositLimit: depositLimit,
            monthlyDepositExpiry: now,
            monthlyDepositUpdatedAt: new Date(),
          })
          .save();
      }

      return { limit, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
