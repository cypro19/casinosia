import logger from "../app/common/logger";

const { Client } = require("@opensearch-project/opensearch");

let elasticClient = null;

const ELASTIC_INDEX = {
  TRANSACTIONS: "casino-gaming-transactions",
};

const startElastic = async () => {
  try {
    const elasticClient = new Client({
      node: process.env.ELASTIC_URL,
      auth: {
        username: process.env.ELASTIC_USER,
        password: process.env.ELASTIC_PASSWORD,
      },
      ssl: {
        rejectUnauthorized: false,
      },
    });

    await elasticClient.cluster.health();

    logger.custom("info", "Connected to Elastic Server");
  } catch (error) {
    elasticClient = null;
    logger.error("Elastic Connection error : " + error.message);
  }
};

startElastic();

export { elasticClient, ELASTIC_INDEX };
