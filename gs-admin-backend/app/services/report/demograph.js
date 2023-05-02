import db from "../../db/models";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { filterByDateCreatedAt } from "../../utils/common";
import ServiceBase from "../../common/serviceBase";
import { convertToCsv, getCsvFileName } from "../helper/email";
import {
  COUNTRY_CURRENCY_MAPPER,
  ROLE,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "../../utils/constant";
import {
  getCountryCodeList,
  getKpiReportDates,
  internationalNumberFormatter,
} from "../helper/elastic";
import { createDemographCsv } from "../helper/csv";
import { getOne } from "../helper/crud";

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
        "last90days",
        "weektodate",
        "yeartodate",
        "previousmonth",
      ],
      message:
        "can be display for 'today', 'yesterday', 'monthtodate', 'previousyear', 'custom', 'last7days', 'last30days', 'last90days', 'weektodate', 'yeartodate', 'previousmonth'",
    },
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
  csvDownload: {
    presence: false,
  },
  user: {
    presence: false,
  },
};

export class GetDemoGraphService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let {
      userType,
      adminId,
      id,
      startDate,
      endDate,
      csvDownload,
      dateOptions,
      user,
    } = this.filteredArgs;

    try {
      let query;
      let depositQuery = {
        actioneeType: ROLE.USER,
        transactionType: TRANSACTION_TYPE.DEPOSIT,
        status: TRANSACTION_STATUS.SUCCESS,
      };

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
        query = filterByDateCreatedAt(query, startDate, endDate, "User");
      if (startDate || endDate)
        depositQuery = filterByDateCreatedAt(
          depositQuery,
          startDate,
          endDate,
          "TransactionBanking"
        );

      if (userType === ROLE.SUPERADMIN && adminId) {
        query = { ...query, parentType: ROLE.ADMIN, parentId: adminId };
        depositQuery = { ...depositQuery, adminId };
      } else if (userType === ROLE.ADMIN) {
        if (user.adminRoleId !== 1) {
          query = { ...query, parentType: ROLE.ADMIN, parentId: user.parentId };
          depositQuery = { ...depositQuery, adminId: user.parentId };
        } else {
          query = { ...query, parentType: ROLE.ADMIN, parentId: id };
          depositQuery = { ...depositQuery, adminId: id };
        }
      }

      const users = await db.User.findAndCountAll({
        where: query,
        attributes: [],
        group: [db.sequelize.col("User.country_code")],
        raw: true,
      });

      const deposit = await db.TransactionBanking.findAndCountAll({
        where: depositQuery,
        attributes: [
          "countryCode",
          [
            db.sequelize.fn("sum", db.sequelize.col("primary_currency_amount")),
            "depositAmount",
          ],
        ],
        group: [db.sequelize.col("TransactionBanking.country_code")],
        raw: true,
      });

      const depositCount = await db.TransactionBanking.findAll({
        where: depositQuery,
        attributes: ["countryCode"],
        group: [
          db.sequelize.col("TransactionBanking.country_code"),
          db.sequelize.col("TransactionBanking.actionee_id"),
        ],
        raw: true,
      });

      const userSignup = users.count;
      const depositAmount = deposit.rows;

      const countryCodeList = getCountryCodeList({
        userSignup,
        depositAmount,
        depositCount,
      });

      const demographic = [];

      for (let index = 0; index < countryCodeList.length; index++) {
        const countryCode = countryCodeList[index];
        const newObject = {};

        newObject.country_code = countryCode;
        newObject.signUpCount = internationalNumberFormatter(
          userSignup[
            Object.keys(userSignup).find(
              (key) => userSignup[key].country_code === countryCode
            )
          ]?.count || 0
        );
        newObject.depositCount = internationalNumberFormatter(
          depositCount.filter((country) => country.countryCode === countryCode)
            .length
        );
        newObject.countryName = (
          await getOne({
            model: db.Country,
            data: { code: countryCode },
            raw: true,
            attributes: ["name"],
          })
        ).name;
        newObject.currency = [COUNTRY_CURRENCY_MAPPER[countryCode]][0] || null;
        newObject.conversionRate = 0;
        if (newObject.signUpCount > 0)
          newObject.conversionRate = internationalNumberFormatter(
            Math.abs(
              (newObject.depositCount / newObject.signUpCount) * 100
            ).toFixed(2)
          );
        newObject.depositAmount = internationalNumberFormatter(
          depositAmount[
            Object.keys(depositAmount).find(
              (key) => depositAmount[key].countryCode === countryCode
            )
          ]?.depositAmount?.toFixed(2) || 0
        );

        demographic.push(newObject);
      }

      if (csvDownload && demographic.length !== 0) {
        const { fields, data } = createDemographCsv(demographic);
        const csvData = convertToCsv({
          fields,
          data,
        });

        return { csv: true, csvData, fileName: getCsvFileName() };
      }

      return { demographic };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
