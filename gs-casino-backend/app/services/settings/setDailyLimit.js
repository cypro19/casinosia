import db from "../../db/models";
import { getOne } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { comparePassword } from "../../utils/common";
import { APP_ERROR_CODES, ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  id: {
    presence: { allowEmpty: false },
  },
  user: {
    presence: { allowEmpty: false },
  },
  daily: {
    presence: false,
  },
  weekly: {
    presence: false,
  },
  monthly: {
    presence: false,
  },
  reset: {
    presence: false,
  },
  password: {
    presence: { allowEmpty: false },
  },
};

export class SetDailyLimitService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { id, user, daily, weekly, monthly, password, reset } =
      this.filteredArgs;

    try {
      if (!(await comparePassword(password, user.password)))
        return { code: 455, message: APP_ERROR_CODES.INCORRECT_PASSWORD };

      const userLimits = await getOne({
        model: db.Limit,
        data: { userId: id },
      });

      if (reset) {
        if (
          daily &&
          !(
            userLimits.dailyBetExpiry &&
            new Date(userLimits.dailyBetExpiry) >= new Date()
          )
        ) {
          await userLimits
            .set({
              dailyBetLimit: null,
              dailyBetExpiry: null,
              dailyBetUpdatedAt: new Date(),
            })
            .save();
        }
        if (
          weekly &&
          !(
            userLimits.weeklyBetExpiry &&
            new Date(userLimits.weeklyBetExpiry) >= new Date()
          )
        ) {
          await userLimits
            .set({
              weeklyBetLimit: null,
              weeklyBetExpiry: null,
              weeklyBetUpdatedAt: new Date(),
            })
            .save();
        }
        if (
          monthly &&
          !(
            userLimits.monthlyBetExpiry &&
            new Date(userLimits.monthlyBetExpiry) >= new Date()
          )
        ) {
          await userLimits
            .set({
              monthlyBetLimit: null,
              monthlyBetExpiry: null,
              monthlyBetUpdatedAt: new Date(),
            })
            .save();
        }

        return { reset: true, limit: userLimits };
      } else {
        const updatedData = {};
        const error = [];

        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 1);

        if (daily) {
          if (
            userLimits.dailyBetLimit &&
            userLimits.dailyBetLimit <= daily &&
            new Date(userLimits.dailyBetExpiry) >= new Date()
          ) {
            error.push(
              `${ERROR_MSG.UPDATE_DAILY_LIMIT}Daily limit till ${userLimits.dailyBetExpiry}`
            );
          } else {
            updatedData.dailyBetLimit = daily;
            updatedData.dailyBetExpiry = expiry;
            updatedData.dailyBetUpdatedAt = new Date();
          }
        }
        if (weekly) {
          if (
            userLimits.weeklyBetLimit &&
            userLimits.weeklyBetLimit <= weekly &&
            new Date(userLimits.weeklyBetExpiry) >= new Date()
          ) {
            error.push(
              `${ERROR_MSG.UPDATE_DAILY_LIMIT}weekly limit till ${userLimits.weeklyBetExpiry}`
            );
          } else {
            updatedData.weeklyBetLimit = weekly;
            updatedData.weeklyBetExpiry = expiry;
            updatedData.weeklyBetUpdatedAt = new Date();
          }
        }
        if (monthly) {
          if (
            userLimits.monthlyBetLimit &&
            userLimits.monthlyBetLimit <= monthly &&
            new Date(userLimits.monthlyBetExpiry) >= new Date()
          ) {
            error.push(
              `${ERROR_MSG.UPDATE_DAILY_LIMIT}monthly limit till ${userLimits.monthlyBetExpiry}`
            );
          } else {
            updatedData.monthlyBetLimit = monthly;
            updatedData.monthlyBetExpiry = expiry;
            updatedData.monthlyBetUpdatedAt = new Date();
          }
        }

        await userLimits.set(updatedData).save();

        if (error.length === 0)
          return { limit: userLimits, message: SUCCESS_MSG.UPDATE_SUCCESS };
        return { limit: userLimits, error };
      }
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
