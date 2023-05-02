import config from "../config/app";
import logger from "../app/common/logger";
import { ELASTIC_MAPPINGS } from "../app/services/common/elastic";

const { Client } = require("@opensearch-project/opensearch");

const ELASTIC_INDEX = {
  TRANSACTIONS: "gaming-transactions",
};

let elasticClient;
const startElastic = async () => {
  try {
    elasticClient = new Client({
      node: config.get("elastic.url"),
      auth: {
        username: config.get("elastic.user"),
        password: config.get("elastic.password"),
      },
      ssl: {
        rejectUnauthorized: false,
      },
    });

    // To check connection
    await elasticClient.cluster.health();

    // To check index exist if not then create index
    if (
      !(await elasticClient.indices.exists({
        index: ELASTIC_INDEX.TRANSACTIONS,
      }))
    ) {
      await elasticClient.indices.create({
        index: ELASTIC_INDEX.TRANSACTIONS,
        body: ELASTIC_MAPPINGS[ELASTIC_INDEX.TRANSACTIONS],
      });
    }

    logger.custom("info", "Connected to Elastic Server");
  } catch (error) {
    logger.error("Elastic Connection error : " + error.message);
  }
};

startElastic();

export { elasticClient, ELASTIC_INDEX };
