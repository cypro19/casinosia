import Logger from "./logger";
import config from "../configs/app.config";
import { ELASTIC_INDEX, ELASTIC_MAPPINGS } from "./constants";

const { Client } = require("@elastic/elasticsearch");

const startElastic = async () => {
  try {
    Logger.info("Elastic Client", { message: "Elastic connection init" });

    const URL =
      "http://" +
      config.get("elastic.user") +
      ":" +
      config.get("elastic.password") +
      "@" +
      config.get("elastic.ip") +
      ":" +
      config.get("elastic.port");

    const elasticClient = new Client({
      node: URL,
    });

    // To check connection
    Logger.info("Elastic Client", { message: "Checking elastic connection" });
    await elasticClient.cluster.health();

    // To check index exist if not then create index
    if (
      !(await elasticClient.indices.exists({
        index: ELASTIC_INDEX.TRANSACTIONS,
      }))
    ) {
      Logger.info("Elastic Client", {
        message: "Creating index by default index not found",
      });

      await elasticClient.indices.create({
        index: ELASTIC_INDEX.TRANSACTIONS,
        body: ELASTIC_MAPPINGS[ELASTIC_INDEX.TRANSACTIONS],
      });
    }

    Logger.info("Elastic Client", {
      message: "Elastic connection established",
    });
    return { elasticClient, success: true };
  } catch (error) {
    Logger.error("Elastic Client", {
      message: "Error in elastic client connection",
      exception: error,
    });
    return {
      success: false,
      message: "Error while connection to elastic server",
      data: null,
      error,
    };
  }
};

export default startElastic;
