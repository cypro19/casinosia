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

export class SetLossLimitService extends ServiceBase {
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
            userLimits.dailyLossExpiry &&
            new Date(userLimits.dailyLossExpiry) >= new Date()
          )
        ) {
          await userLimits
            .set({
              dailyLossLimit: null,
              dailyLossExpiry: null,
              dailyLossUpdatedAt: new Date(),
            })
            .save();
        }
        if (
          weekly &&
          !(
            userLimits.weeklyLossExpiry &&
            new Date(userLimits.weeklyLossExpiry) >= new Date()
          )
        ) {
          await userLimits
            .set({
              weeklyLossLimit: null,
              weeklyLossExpiry: null,
              weeklyLossUpdatedAt: new Date(),
            })
            .save();
        }
        if (
          monthly &&
          !(
            userLimits.monthlyLossExpiry &&
            new Date(userLimits.monthlyLossExpiry) >= new Date()
          )
        ) {
          await userLimits
            .set({
              monthlyLossLimit: null,
              monthlyLossExpiry: null,
              monthlyLossUpdatedAt: new Date(),
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
            userLimits.dailyLossLimit &&
            userLimits.dailyLossLimit <= daily &&
            new Date(userLimits.dailyLossExpiry) >= new Date()
          ) {
            error.push(
              `${ERROR_MSG.UPDATE_DAILY_LIMIT}Daily limit till ${userLimits.dailyLossExpiry}`
            );
          } else {
            updatedData.dailyLossLimit = daily;
            updatedData.dailyLossExpiry = expiry;
            updatedData.dailyLossUpdatedAt = new Date();
          }
        }
        if (weekly) {
          if (
            userLimits.weeklyLossLimit &&
            userLimits.weeklyLossLimit <= weekly &&
            new Date(userLimits.weeklyLossExpiry) >= new Date()
          ) {
            error.push(
              `${ERROR_MSG.UPDATE_DAILY_LIMIT}weekly limit till ${userLimits.weeklyLossExpiry}`
            );
          } else {
            updatedData.weeklyLossLimit = weekly;
            updatedData.weeklyLossExpiry = expiry;
            updatedData.weeklyLossUpdatedAt = new Date();
          }
        }
        if (monthly) {
          if (
            userLimits.monthlyLossLimit &&
            userLimits.monthlyLossLimit <= monthly &&
            new Date(userLimits.monthlyLossExpiry) >= new Date()
          ) {
            error.push(
              `${ERROR_MSG.UPDATE_DAILY_LIMIT}monthly limit till ${userLimits.monthlyLossExpiry}`
            );
          } else {
            updatedData.monthlyLossLimit = monthly;
            updatedData.monthlyLossExpiry = expiry;
            updatedData.monthlyLossUpdatedAt = new Date();
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
