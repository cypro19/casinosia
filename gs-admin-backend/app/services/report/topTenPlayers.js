import db from "../../db/models";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { filterByDateCreatedAt, topPlayerResponse } from "../../utils/common";
import ServiceBase from "../../common/serviceBase";
import {
  ROLE,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "../../utils/constant";
import { getKpiReportDates } from "../helper/elastic";

const constraints = {
  adminId: {
    presence: false,
  },
  userType: {
    presence: { allowEmpty: false },
  },
  dateOptions: {
    presence: false,
    inclusion: {
      within: [
        "today",
        "yesterday",
        "monthtodate",
        "previousyear",
        "custom",
        "last7days",
        "last30days",
        "previousmonth",
        "last90days",
        "yeartodate",
        "weektodate",
      ],
      message:
        "can be display for 'today', 'yesterday', 'monthtodate', 'previousyear', 'custom', 'last7days', 'last30days', 'last90days', 'weektodate', 'yeartodate', 'previousmonth'",
    },
  },
  limit: {
    presence: false,
  },
  id: {
    presence: { allowEmpty: false },
  },
  startDate: {
    presence: false,
  },
  endDate: {
    presence: false,
  },
  user: {
    presence: false,
  },
};

export class GetTopTenService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let {
      userType,
      adminId,
      id,
      limit,
      startDate,
      endDate,
      dateOptions,
      user,
    } = this.filteredArgs;

    try {
      let query, depositQuery;

      if (!dateOptions) {
        dateOptions = "today";
      }

      if (dateOptions === "custom") {
        if (!startDate || !endDate)
          return this.addError(
            ERRORS.BAD_DATA,
            ERROR_MSG.CUSTOM_DATES_REQUIRED
          );
      }

      const filterDates = getKpiReportDates({
        dateOptions,
        customStartDate: startDate,
        customEndDate: endDate,
      });

      startDate = filterDates.startDate;
      endDate = filterDates.endDate;

      if (startDate || endDate)
        query = filterByDateCreatedAt(
          query,
          startDate,
          endDate,
          "CasinoTransaction"
        );
      if (startDate || endDate)
        depositQuery = filterByDateCreatedAt(
          depositQuery,
          startDate,
          endDate,
          "TransactionBanking"
        );

      if (!limit) {
        limit = 10;
      }

      if (userType === ROLE.SUPERADMIN && adminId) {
        query = { ...query, adminId };
        depositQuery = { ...depositQuery, adminId };
      } else if (userType === ROLE.ADMIN) {
        if (user.adminRoleId !== 1) {
          query = { ...query, adminId: user.parentId };
          depositQuery = { ...depositQuery, adminId: user.parentId };
        } else {
          query = { ...query, adminId: id };
          depositQuery = { ...depositQuery, adminId: id };
        }
      }

      const topTenWinners = await db.CasinoTransaction.findAll({
        where: { ...query, status: 1 },
        attributes: [
          [
            db.sequelize
              .literal(`ROUND(cast(sum(case when action_type = 'win' then primary_currency_amount else 0 end) -
          sum(case when action_type = 'bet' then primary_currency_amount else 0 end)as numeric),2) `),
            "amount",
          ],
          "userId",
        ],
        include: [
          {
            model: db.User,
            attributes: ["countryCode", "username", "level"],
          },
        ],
        group: [
          db.sequelize.col("CasinoTransaction.user_id"),
          db.sequelize.col("User.country_code"),
          db.sequelize.col("User.username"),
          db.sequelize.col("User.level"),
        ],
        order: [
          [
            db.sequelize
              .literal(`ROUND(cast(sum(case when action_type = 'win' then primary_currency_amount else 0 end) -
        sum(case when action_type = 'bet' then primary_currency_amount else 0 end)as numeric),2) `),
            "DESC",
          ],
        ],
        having: db.sequelize
          .literal(`ROUND(cast(sum(case when action_type = 'win' then primary_currency_amount else 0 end) -
        sum(case when action_type = 'bet' then primary_currency_amount else 0 end)as numeric),2) > 0`),
        limit,
        offset: 0,
        raw: true,
      });

      const topTenLosers = await db.CasinoTransaction.findAll({
        where: { ...query, status: 1 },
        attributes: [
          [
            db.sequelize
              .literal(`ROUND(cast(sum(case when action_type = 'bet' then primary_currency_amount else 0 end) -
          sum(case when action_type = 'win' then primary_currency_amount else 0 end)as numeric),2) `),
            "amount",
          ],
          "userId",
        ],
        include: [
          {
            model: db.User,
            attributes: ["countryCode", "username", "level"],
            include: [],
          },
        ],
        group: [
          db.sequelize.col("CasinoTransaction.user_id"),
          db.sequelize.col("User.country_code"),
          db.sequelize.col("User.username"),
          db.sequelize.col("User.level"),
        ],
        order: [
          [
            db.sequelize
              .literal(`ROUND(cast(sum(case when action_type = 'bet' then primary_currency_amount else 0 end) -
        sum(case when action_type = 'win' then primary_currency_amount else 0 end)as numeric),2) `),
            "DESC",
          ],
        ],
        having: db.sequelize
          .literal(`ROUND(cast(sum(case when action_type = 'bet' then primary_currency_amount else 0 end) -
        sum(case when action_type = 'win' then primary_currency_amount else 0 end)as numeric),2) > 0`),
        limit,
        offset: 0,
        raw: true,
      });

      const topTenDepositors = await db.TransactionBanking.findAll({
        where: {
          ...depositQuery,
          actioneeType: ROLE.USER,
          transactionType: TRANSACTION_TYPE.DEPOSIT,
          status: TRANSACTION_STATUS.SUCCESS,
        },
        attributes: [
          "actioneeId",
          "countryCode",
          [
            db.sequelize.literal(
              "round(cast(sum(primary_currency_amount) as numeric),2)"
            ),
            "depositAmount",
          ],
        ],
        include: [
          {
            model: db.User,
            attributes: [["username", "actioneeName"], "level"],
            as: "transactionUser",
          },
        ],
        group: [
          db.sequelize.col("TransactionBanking.actionee_id"),
          db.sequelize.col("TransactionBanking.country_code"),
          db.sequelize.col("transactionUser.username"),
          db.sequelize.col("transactionUser.level"),
        ],
        having: db.sequelize.literal(
          "round(cast(sum(primary_currency_amount) as numeric),2) > 0"
        ),
        order: [
          [
            db.sequelize.literal(
              "round(cast(sum(primary_currency_amount) as numeric),2)"
            ),
            "DESC",
          ],
        ],
        limit,
        offset: 0,
        raw: true,
      });

      return {
        topTenWinners: topPlayerResponse(topTenWinners),
        topTenLosers: topPlayerResponse(topTenLosers),
        topTenDepositors: topPlayerResponse(topTenDepositors),
      };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
