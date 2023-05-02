// import db from "../app/db/models";
import logger from "../app/common/logger";
// import { ELASTIC_MAPPINGS, reindexData } from "../app/services/helper/elastic";

const { Client } = require("@opensearch-project/opensearch");
// const cron = require("node-cron");

const ELASTIC_INDEX = {
  TRANSACTIONS: "casino-gaming-transactions",
};

// const resetLoginInCount = async () => {
//   await db.User.update({ loggedIn: 0 }, { where: { isEmailVerified: true } });
//   logger.info("-------User Log In count reset done-------");
// };

// cron.schedule("0 */12 * * *", async () => await reindexData());
// cron.schedule("0 0 0 * * *", async () => await resetLoginInCount());

let elasticClient;
const startElastic = async () => {
  try {
    elasticClient = new Client({
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

    // To check connection
    await elasticClient.cluster.health();

    // To check index exist if not then create index
    // if (
    //   !(await elasticClient.indices.exists({
    //     index: ELASTIC_INDEX.TRANSACTIONS,
    //   }))
    // ) {
    //   await elasticClient.indices.create({
    //     index: ELASTIC_INDEX.TRANSACTIONS,
    //     body: ELASTIC_MAPPINGS[ELASTIC_INDEX.TRANSACTIONS],
    //   });
    // }

    logger.custom("verbose", "Connected to Elastic Server");
  } catch (error) {
    logger.error("Elastic Connection error : " + error.message);
  }
};

startElastic();

export { elasticClient, ELASTIC_INDEX };
