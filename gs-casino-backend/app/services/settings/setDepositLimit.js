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

export class SetDepositLimitService extends ServiceBase {
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
            userLimits.dailyDepositExpiry &&
            new Date(userLimits.dailyDepositExpiry) >= new Date()
          )
        ) {
          await userLimits
            .set({
              dailyDepositLimit: null,
              dailyDepositExpiry: null,
              dailyDepositUpdatedAt: new Date(),
            })
            .save();
        }
        if (
          weekly &&
          !(
            userLimits.weeklyDepositExpiry &&
            new Date(userLimits.weeklyDepositExpiry) >= new Date()
          )
        ) {
          await userLimits
            .set({
              weeklyDepositLimit: null,
              weeklyDepositExpiry: null,
              weeklyDepositUpdatedAt: new Date(),
            })
            .save();
        }
        if (
          monthly &&
          !(
            userLimits.monthlyDepositExpiry &&
            new Date(userLimits.monthlyDepositExpiry) >= new Date()
          )
        ) {
          await userLimits
            .set({
              monthlyDepositLimit: null,
              monthlyDepositExpiry: null,
              monthlyDepositUpdatedAt: new Date(),
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
            userLimits.dailyDepositLimit &&
            userLimits.dailyDepositLimit <= daily &&
            new Date(userLimits.dailyDepositExpiry) >= new Date()
          ) {
            error.push(
              `${ERROR_MSG.UPDATE_DAILY_LIMIT}Daily limit till ${userLimits.dailyDepositExpiry}`
            );
          } else {
            updatedData.dailyDepositLimit = daily;
            updatedData.dailyDepositExpiry = expiry;
            updatedData.dailyDepositUpdatedAt = new Date();
          }
        }
        if (weekly) {
          if (
            userLimits.weeklyDepositLimit &&
            userLimits.weeklyDepositLimit <= weekly &&
            new Date(userLimits.weeklyDepositExpiry) >= new Date()
          ) {
            error.push(
              `${ERROR_MSG.UPDATE_DAILY_LIMIT}weekly limit till ${userLimits.weeklyDepositExpiry}`
            );
          } else {
            updatedData.weeklyDepositLimit = weekly;
            updatedData.weeklyDepositExpiry = expiry;
            updatedData.weeklyDepositUpdatedAt = new Date();
          }
        }
        if (monthly) {
          if (
            userLimits.monthlyDepositLimit &&
            userLimits.monthlyDepositLimit <= monthly &&
            new Date(userLimits.monthlyDepositExpiry) >= new Date()
          ) {
            error.push(
              `${ERROR_MSG.UPDATE_DAILY_LIMIT}monthly limit till ${userLimits.monthlyDepositExpiry}`
            );
          } else {
            updatedData.monthlyDepositLimit = monthly;
            updatedData.monthlyDepositExpiry = expiry;
            updatedData.monthlyDepositUpdatedAt = new Date();
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
