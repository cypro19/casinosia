import { Op } from "sequelize";
import db from "../../db/models";
import { ERRORS } from "../../utils/errors";
import { filterByDateCreatedAt } from "../../utils/common";
import ServiceBase from "../../common/serviceBase";
import {
  ROLE,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "../../utils/constant";
import { internationalNumberFormatter } from "../helper/elastic";

const constraints = {
  adminId: {
    presence: false,
  },
  userType: {
    presence: { allowEmpty: false },
  },
  id: {
    presence: { allowEmpty: false },
  },
  user: {
    presence: { allowEmpty: false },
  },
};

export class GetLivePlayerService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { userType, adminId, id, user } = this.filteredArgs;

    try {
      let query, ggrQuery, userVisitQuery, depositQuery;

      ggrQuery = filterByDateCreatedAt(
        query,
        Date.now(),
        Date.now(),
        "CasinoTransaction"
      );

      if (userType === ROLE.SUPERADMIN && adminId) {
        query = { ...query, parentType: ROLE.ADMIN, parentId: adminId };
        ggrQuery = { ...ggrQuery, adminId };
        userVisitQuery = { ...userVisitQuery, adminId };
        depositQuery = { ...depositQuery, adminId };
      } else if (userType === ROLE.ADMIN) {
        if (user.adminRoleId !== 1) {
          query = { ...query, parentType: ROLE.ADMIN, parentId: user.parentId };
          ggrQuery = { ...ggrQuery, adminId: user.parentId };
          userVisitQuery = { ...userVisitQuery, adminId: user.parentId };
          depositQuery = { ...depositQuery, adminId: user.parentId };
        } else {
          query = { ...query, parentType: userType, parentId: id };
          ggrQuery = { ...ggrQuery, adminId: id };
          userVisitQuery = { ...userVisitQuery, adminId: id };
          depositQuery = { ...depositQuery, adminId: id };
        }
      }

      const totalPlayer = await db.User.count({ where: query });

      const totalWinAmount = await db.CasinoTransaction.sum(
        "primaryCurrencyAmount",
        { where: { ...ggrQuery, actionType: "win", status: 1 } }
      );

      const totalBetAmount = await db.CasinoTransaction.sum(
        "primaryCurrencyAmount",
        { where: { ...ggrQuery, actionType: "bet", status: 1 } }
      );

      const loggedIn = await db.User.findAndCountAll({
        where: { ...query, loggedIn: { [Op.gt]: 0 } },
        attributes: ["loggedIn"],
        raw: true,
      });

      const deviceLoggedInCount = await db.User.findAndCountAll({
        where: { ...query, loggedIn: { [Op.gt]: 0 } },
        attributes: ["deviceType"],
        group: [db.sequelize.col("User.device_type")],
        raw: true,
      });

      const depositCounts = await db.TransactionBanking.findAndCountAll({
        where: {
          ...depositQuery,
          actioneeType: ROLE.USER,
          transactionType: TRANSACTION_TYPE.DEPOSIT,
          status: TRANSACTION_STATUS.SUCCESS,
        },
        attributes: [],
        group: [db.sequelize.col("TransactionBanking.actionee_id")],
        raw: true,
      });

      const userVisitCount = await db.UniqueUserIdentification.count({
        where: userVisitQuery,
      });

      const todayTotalGgr = (totalBetAmount - totalWinAmount).toFixed(2);
      const loggedInPlayer = loggedIn.count;
      const deviceLoggedIn = deviceLoggedInCount.count;
      let registrationConvRate = 0;
      let depositConvRate = 0;

      if (userVisitCount !== 0) {
        registrationConvRate = Math.abs(
          (totalPlayer / userVisitCount) * 100
        ).toFixed(2);
      }

      if (totalPlayer !== 0) {
        depositConvRate = Math.abs(
          (depositCounts.count.length / totalPlayer) * 100
        ).toFixed(2);
      }

      return {
        totalPlayers: internationalNumberFormatter(totalPlayer),
        todayTotalGgr: internationalNumberFormatter(todayTotalGgr),
        loggedInPlayer,
        depositConvRate,
        registrationConvRate,
        deviceLoggedIn,
      };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
