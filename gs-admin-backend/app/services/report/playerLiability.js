import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { ROLE } from "../../utils/constant";
import { convertToCsv, getCsvFileName } from "../helper/email";
import { elasticClient, ELASTIC_INDEX } from "../../../server/elasticClient";
import { createPlayerLiabilityCsv } from "../helper/csv";
import {
  getKpiReportDates,
  getPlayerLiabilityQuery,
  sortPlayerLiabilityData,
} from "../helper/elastic";

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
        "previousyear",
        "custom",
        "previousmonth",
        "last7days",
        "last30days",
        "last90days",
        "weektodate",
        "yeartodate",
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

export class GetPlayerLiabilityService extends ServiceBase {
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
      if (!(await elasticClient.ping())) {
        this.addError(ERRORS.SERVER_UNAVAILABLE, ERROR_MSG.ELASTIC_CONNECTION);
      }

      const mainQuery = {
        bool: {
          must: [],
        },
      };

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

      const playerLiabilityQuery = getPlayerLiabilityQuery({
        query: JSON.parse(JSON.stringify(mainQuery)),
        startDate,
        endDate,
      });

      const response = await elasticClient.search({
        index: ELASTIC_INDEX.TRANSACTIONS,
        body: playerLiabilityQuery,
      });

      const playerLiability = response.body.aggregations;

      const sortedPlayerLiability = await sortPlayerLiabilityData(
        playerLiability
      );

      if (csvDownload && sortedPlayerLiability.length !== 0) {
        const { fields, data } = createPlayerLiabilityCsv(
          sortedPlayerLiability.playerLiability
        );
        const csvData = convertToCsv({
          fields,
          data,
        });

        return { csv: true, csvData, fileName: getCsvFileName() };
      }
      return { ...sortedPlayerLiability };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
