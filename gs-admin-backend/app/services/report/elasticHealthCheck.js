import { ERROR_MSG } from "../../utils/errors";
import ServiceBase from "../../common/serviceBase";
import { elasticClient, ELASTIC_INDEX } from "../../../server/elasticClient";

export class ElasticHealthCheckService extends ServiceBase {
  async run() {
    try {
      // if (userType !== ROLE.SUPERADMIN && user.superRoleId !== ROLE_ID.SUPERADMIN) return { message: ERROR_MSG.NOT_ALLOWED }

      const ping = await elasticClient.ping();
      const health = await elasticClient.cluster.health();
      const indexExists = await elasticClient.indices.exists({
        index: ELASTIC_INDEX.TRANSACTIONS,
      });

      return { success: true, ping, indexExists, health };
    } catch (error) {
      return { success: false, message: ERROR_MSG.ELASTIC_DOWN };
    }
  }
}
