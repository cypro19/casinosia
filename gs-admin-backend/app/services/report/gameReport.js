import { ROLE } from "../../utils/constant";
import ServiceBase from "../../common/serviceBase";
import { createGameReportCsv } from "../helper/csv";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { convertToCsv, getCsvFileName } from "../helper/email";
import { elasticClient, ELASTIC_INDEX } from "../../../server/elasticClient";
import {
  getGameReportQuery,
  getKpiReportDates,
  createGameReport,
} from "../helper/elastic";

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
  userId: {
    presence: false,
  },
  tab: {
    presence: { allowEmpty: false },
    inclusion: {
      within: ["game", "provider"],
      message: "can be display for game, provider",
    },
  },
  limit: {
    presence: false,
  },
  user: {
    presence: false,
  },
};

export class GetGameReportService extends ServiceBase {
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
      userId,
      limit,
      user,
    } = this.filteredArgs;
    let groupBy;

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

      if (!limit) {
        limit = 10;
      }

      if (tab === "provider") {
        groupBy = "gameProviderId";
      } else if (tab === "game") {
        groupBy = "gameIdentifier";
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
      if (userId) {
        mainQuery.bool.must.push({ match: { "user.userId": userId } });
      }

      const { startDate, endDate } = getKpiReportDates({
        dateOptions,
        customEndDate,
        customStartDate,
      });

      const gameReportQuery = getGameReportQuery({
        query: JSON.parse(JSON.stringify(mainQuery)),
        startDate,
        endDate,
        groupBy,
      });

      const response = await elasticClient.search({
        index: ELASTIC_INDEX.TRANSACTIONS,
        body: {
          size: 0,
          ...gameReportQuery,
        },
      });

      const gameReport = response.body.aggregations;

      const gameReportResponse = await createGameReport(
        gameReport,
        tab,
        userId,
        limit
      );

      if (csvDownload && gameReportResponse.length !== 0) {
        const { fields, data } = createGameReportCsv(
          gameReportResponse,
          tab,
          userId
        );
        const csvData = convertToCsv({
          fields,
          data,
        });

        return { csv: true, csvData, fileName: getCsvFileName() };
      }

      return { gameReport: gameReportResponse };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
