import { TRANSACTION_TYPE } from "../../utils/constant";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { convertToCsv, getCsvFileName } from "../helper/email";
import { ELASTIC_INDEX } from "../../../server/elasticClient";
import {
  getBetQuery,
  getBonusWinsAndBonusBets,
  getDepositQuery,
  getActiveUsersQuery,
  getNewPlayers,
  getNewDepositorsQuery,
  getWithdrawRequestData,
  getDepositConversionRate,
  createKpiSummaryResponse,
  getBonusCountAndAmountQuery,
  getKPIReportFilterDates,
} from "../helper/elastic";
import { createKpiSummaryCsv } from "../helper/csv";
const { Client } = require("@opensearch-project/opensearch");

const constraints = {
  startDate: {
    presence: false,
  },
  endDate: {
    presence: false,
  },
  csvDownload: {
    presence: false,
  },
};

export class GetKPISummaryService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { startDate, endDate, csvDownload } = this.filteredArgs;

    try {
      const mainQuery = {
        bool: {
          must: [],
        },
      };
      const dbUserQuery = {};
      const withdrawQuery = { transactionType: TRANSACTION_TYPE.WITHDRAW };
      const KPISummary = {};

      const elasticClient = new Client({
        node: process.env.ELASTIC_URL,
        auth: {
          username: process.env.ELASTIC_USER,
          password: process.env.ELASTIC_PASSWORD,
        },
        ssl: {
          // ca: fs.readFileSync(process.env.ELASTIC_HTTP_CRT_PATH),
          rejectUnauthorized: false,
        },
      });
      
      if (!(await elasticClient.ping())) {
        this.addError(ERRORS.SERVER_UNAVAILABLE, ERROR_MSG.ELASTIC_CONNECTION);
      }

      const {
        today,
        monthStartDate,
        previousMonthStartDate,
        perviousMonthToday,
      } = getKPIReportFilterDates();

      const betQuery = getBetQuery({
        query: JSON.parse(JSON.stringify(mainQuery)),
        startDate,
        endDate,
      });

      KPISummary.betCountsAndAmounts = (
        await elasticClient.search({
          index: ELASTIC_INDEX.TRANSACTIONS,
          body: {
            size: 0,
            ...betQuery,
          },
        })
      ).body.aggregations;

      const bonusBetQuery = getBonusWinsAndBonusBets({
        query: JSON.parse(JSON.stringify(mainQuery)),
        startDate,
        endDate,
      });

      KPISummary.bonusBetsAndWins = (
        await elasticClient.search({
          index: ELASTIC_INDEX.TRANSACTIONS,
          body: {
            size: 0,
            ...bonusBetQuery,
          },
        })
      ).body.aggregations;

      const depositQuery = getDepositQuery({
        query: JSON.parse(JSON.stringify(mainQuery)),
        startDate,
        endDate,
        transactionType: TRANSACTION_TYPE.DEPOSIT,
      });

      KPISummary.depositCountAndDepositAmount = (
        await elasticClient.search({
          index: ELASTIC_INDEX.TRANSACTIONS,
          body: {
            size: 0,
            ...depositQuery,
          },
        })
      ).body.aggregations;

      const activeUsersQuery = getActiveUsersQuery({
        query: JSON.parse(JSON.stringify(mainQuery)),
        startDate,
        endDate,
      });

      KPISummary.activeUsers = (
        await elasticClient.search({
          index: ELASTIC_INDEX.TRANSACTIONS,
          body: {
            size: 0,
            ...activeUsersQuery,
          },
        })
      ).body.aggregations;

      const bonusQuery = getBonusCountAndAmountQuery({
        query: JSON.parse(JSON.stringify(mainQuery)),
        startDate,
        endDate,
      });

      KPISummary.bonusCountAndAmount = (
        await elasticClient.search({
          index: ELASTIC_INDEX.TRANSACTIONS,
          body: {
            size: 0,
            ...bonusQuery,
          },
        })
      ).body.aggregations;

      KPISummary.newPlayers = await getNewPlayers({
        query: dbUserQuery,
        startDate,
        endDate,
      });

      const newDepositorsQuery = getNewDepositorsQuery({
        query: JSON.parse(JSON.stringify(mainQuery)),
        startDate,
        endDate,
      });

      KPISummary.newDepositors = (
        await elasticClient.search({
          index: ELASTIC_INDEX.TRANSACTIONS,
          body: {
            size: 0,
            ...newDepositorsQuery,
          },
        })
      ).body.aggregations;

      KPISummary.depositConversionRate = getDepositConversionRate(
        KPISummary.newDepositors,
        KPISummary.newPlayers
      );

      KPISummary.withdraw = await getWithdrawRequestData({
        query: withdrawQuery,
        startDate,
        endDate,
      });

      if (csvDownload) {
        const { fields, data } = createKpiSummaryCsv(
          createKpiSummaryResponse(KPISummary)
        );
        const csvData = convertToCsv({
          fields,
          data,
        });

        return { csv: true, csvData, fileName: getCsvFileName() };
      }

      return { KPISummary: createKpiSummaryResponse(KPISummary) };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
