import { ERRORS } from "../../utils/errors";
import ServiceBase from "../../common/serviceBase";
import { getGameReportQuery, createGameReport } from "../helper/elastic";
import { elasticClient, ELASTIC_INDEX } from "../../../server/elasticClient";

const constraints = {
  limit: {
    presence: { allowEmpty: false },
  },
};

export class GetGameReportService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let { limit } = this.filteredArgs;

    try {
      const groupBy = "gameIdentifier.keyword";

      const mainQuery = {
        bool: {
          must: [],
        },
      };

      const today = new Date().toISOString().substring(0, 10);
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      const startDate = lastWeek.toISOString().substring(0, 10);
      const endDate = today;

      if (!limit || limit > 10) {
        limit = 10;
      }

      const gameReportQuery = getGameReportQuery({
        query: JSON.parse(JSON.stringify(mainQuery)),
        startDate,
        endDate,
        groupBy,
      });

      const gameReport = (
        await elasticClient.search({
          index: ELASTIC_INDEX.TRANSACTIONS,
          size: 0,
          ...gameReportQuery,
        })
      ).aggregations;

      const gameReportResponse = await createGameReport(
        gameReport,
        "game",
        null,
        limit
      );

      return { gameReport: gameReportResponse };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
