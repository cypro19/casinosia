import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { ROLE } from "../../utils/constant";
import ServiceBase from "../../common/serviceBase";
import { convertToCsv, getCsvFileName } from "../helper/email";
import { elasticClient, ELASTIC_INDEX } from "../../../server/elasticClient";
import {
  getRealBetandRealWinQuery as getRealBetAndRealWinQuery,
  getBonusWinAndBonusBet,
  getTotalBets,
  getKpiReportDates,
  createKpiReportResponse,
} from "../helper/elastic";
import { createKpiReportCsv } from "../helper/csv";

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
  dateOptions: {
    presence: false,
    inclusion: {
      within: [
        "today",
        "yesterday",
        "monthtodate",
        "previousyear",
        "custom",
        "previousmonth",
        "last7days",
        "yeartodate",
        "last30days",
        "last90days",
        "weektodate",
      ],
      message:
        "can be display for 'today', 'yesterday', 'monthtodate', 'previousyear', 'custom', 'last7days', 'last30days', 'last90days', 'weektodate', 'yeartodate', 'previousmonth'",
    },
  },
  customStartDate: {
    presence: false,
  },
  customEndDate: {
    presence: false,
  },
  csvDownload: {
    presence: false,
  },
  tab: {
    presence: false,
    inclusion: {
      within: ["game", "provider"],
      message: "can be display for game, provider",
    },
  },
  user: {
    presence: false,
  },
};

export class GetKPIReportService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let {
      userType,
      adminId,
      id,
      dateOptions,
      csvDownload,
      customEndDate,
      customStartDate,
      tab,
      user,
    } = this.filteredArgs;

    try {
      const mainQuery = {
        bool: {
          must: [],
        },
      };

      if (!dateOptions) {
        dateOptions = "today";
      }
      if (dateOptions === "custom") {
        if (!customEndDate || !customStartDate)
          return this.addError(
            ERRORS.BAD_DATA,
            ERROR_MSG.CUSTOM_DATES_REQUIRED
          );
      }

      if (userType === ROLE.SUPERADMIN && adminId) {
        mainQuery.bool.must.push({ match: { parentId: adminId } });
        mainQuery.bool.must.push({ match: { parentType: ROLE.ADMIN } });
      } else if (userType === ROLE.ADMIN) {
        if (user.adminRoleId !== 1) {
          mainQuery.bool.must.push({ match: { parentId: user.parentId } });
          mainQuery.bool.must.push({ match: { parentType: ROLE.ADMIN } });
        } else {
          mainQuery.bool.must.push({ match: { parentId: id } });
          mainQuery.bool.must.push({ match: { parentType: ROLE.ADMIN } });
        }
      }

      const KPIReport = {};
      let groupBy;

      if (!tab) {
        tab = "provider";
      }

      if (tab === "provider") {
        groupBy = "gameProviderId";
      } else if (tab === "game") {
        groupBy = "gameIdentifier";
      }

      const { startDate, endDate, deltaStartDate, deltaEndDate } =
        getKpiReportDates({ dateOptions, customEndDate, customStartDate });

      const betAndWinQuery = getRealBetAndRealWinQuery({
        query: JSON.parse(JSON.stringify(mainQuery)),
        startDate,
        endDate,
        groupBy,
      });

      const realAmountResponse = await elasticClient.search({
        index: ELASTIC_INDEX.TRANSACTIONS,
        body: {
          size: 0,
          ...betAndWinQuery,
        },
      });

      KPIReport.realAmounts = realAmountResponse.body.aggregations;

      const deltaBetAndWinQuery = getRealBetAndRealWinQuery({
        query: JSON.parse(JSON.stringify(mainQuery)),
        startDate: deltaStartDate,
        endDate: deltaEndDate,
        groupBy,
      });

      const deltaRealResponse = await elasticClient.search({
        index: ELASTIC_INDEX.TRANSACTIONS,
        body: {
          size: 0,
          ...deltaBetAndWinQuery,
        },
      });

      KPIReport.deltaRealAmounts = deltaRealResponse.body.aggregations;

      const bonusBetAndBonusWinQuery = getBonusWinAndBonusBet({
        query: JSON.parse(JSON.stringify(mainQuery)),
        startDate,
        endDate,
        groupBy,
      });

      const bonusAmountResponse = await elasticClient.search({
        index: ELASTIC_INDEX.TRANSACTIONS,
        body: {
          size: 0,
          ...bonusBetAndBonusWinQuery,
        },
      });

      KPIReport.bonusAmounts = bonusAmountResponse.body.aggregations;

      const TotalBetsQuery = getTotalBets({
        query: JSON.parse(JSON.stringify(mainQuery)),
        startDate,
        endDate,
        groupBy,
      });

      const totalBetsResponse = await elasticClient.search({
        index: ELASTIC_INDEX.TRANSACTIONS,
        body: {
          size: 0,
          ...TotalBetsQuery,
        },
      });

      KPIReport.totalBetsAmounts = totalBetsResponse.body.aggregations;

      const deltaTotalBetsQuery = getTotalBets({
        query: JSON.parse(JSON.stringify(mainQuery)),
        startDate: deltaStartDate,
        endDate: deltaEndDate,
        groupBy,
      });

      const deltaTotalResponse = await elasticClient.search({
        index: ELASTIC_INDEX.TRANSACTIONS,
        body: {
          size: 0,
          ...deltaTotalBetsQuery,
        },
      });

      KPIReport.deltaTotalBetsAmounts = deltaTotalResponse.body.aggregations;

      if (csvDownload) {
        const { fields, data } = createKpiReportCsv(
          await createKpiReportResponse(KPIReport, tab),
          tab
        );
        const csvData = convertToCsv({
          fields,
          data,
        });

        return { csv: true, csvData, fileName: getCsvFileName() };
      }

      return {
        KPIReport: await createKpiReportResponse(KPIReport, tab),
        deltaDate: { startDate, endDate, deltaStartDate, deltaEndDate },
      };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
