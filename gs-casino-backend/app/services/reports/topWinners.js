import db from "../../db/models";
import { ERRORS } from "../../utils/errors";
import ServiceBase from "../../common/serviceBase";
import { filterByDateCreatedAt } from "../../utils/common";
import { TRANSACTION_STATUS_CASINO } from "../../utils/constant";
import { topPlayerResponse } from "../../services/helper/elastic";

const constraints = {
  limit: {
    presence: false,
  },
  startDate: {
    presence: false,
  },
  endDate: {
    presence: false,
  },
};

export class GetTopWinnersService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let { limit, startDate, endDate } = this.filteredArgs;

    try {
      let query = { status: TRANSACTION_STATUS_CASINO.COMPLETED };

      if (!limit || limit > 10) {
        limit = 10;
      }

      if (startDate || endDate)
        query = filterByDateCreatedAt(
          query,
          startDate,
          endDate,
          "CasinoTransaction"
        );

      if (!startDate || !endDate) {
        const today = new Date().toISOString().substring(0, 10);
        const lastWeek = new Date();

        lastWeek.setDate(lastWeek.getDate() - 7);
        startDate = lastWeek.toISOString().substring(0, 10);
        endDate = today;

        query = filterByDateCreatedAt(
          query,
          startDate,
          endDate,
          "CasinoTransaction"
        );
      }

      const topWinners = await db.CasinoTransaction.findAll({
        where: { ...query },
        attributes: [
          [
            db.sequelize
              .literal(`ROUND(cast(sum(case when action_type = 'win' then amount else 0 end) -
          sum(case when action_type = 'bet' then amount else 0 end)as numeric),2) `),
            "amount",
          ],
        ],
        include: [
          {
            model: db.User,
            attributes: ["username", "firstName", "lastName", "currencyCode"],
          },
        ],
        group: [
          db.sequelize.col("User.username"),
          db.sequelize.col("User.first_name"),
          db.sequelize.col("User.last_name"),
          db.sequelize.col("User.currency_code"),
        ],
        order: [
          [
            db.sequelize
              .literal(`ROUND(cast(sum(case when action_type = 'win' then amount else 0 end) -
        sum(case when action_type = 'bet' then amount else 0 end)as numeric),2) `),
            "DESC",
          ],
        ],
        having: db.sequelize
          .literal(`ROUND(cast(sum(case when action_type = 'win' then amount else 0 end) -
        sum(case when action_type = 'bet' then amount else 0 end)as numeric),2) > 0`),
        limit,
        offset: 0,
        raw: true,
      });

      return { topWinners: await topPlayerResponse(topWinners) };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
