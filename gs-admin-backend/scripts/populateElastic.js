const { Client } = require("@opensearch-project/opensearch");
const cliProgress = require("cli-progress");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

console.log("ELASTIC_URL = ", process.env.ELASTIC_URL);
console.log("ELASTIC_PORT = ", process.env.ELASTIC_PORT);
console.log("ELASTIC_USER = ", process.env.ELASTIC_USER);
console.log("ELASTIC_PASSWORD = ", process.env.ELASTIC_PASSWORD);

const ELASTIC_INDEX = {
  TRANSACTIONS: "gaming-transactions",
};

const getCsvFileName = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15) +
    ".csv"
  );
};

var client = new Client({
  node: process.env.ELASTIC_URL,
  auth: {
    username: process.env.ELASTIC_USER,
    password: process.env.ELASTIC_PASSWORD,
  },
  ssl: {
    // ca: fs.readFileSync('/home/rails/excitable_gaming_eg/admin_backend/http_ca.crt'),
    rejectUnauthorized: false,
  },
});

client
  .search({
    body: {
      query: {
        match_all: {},
      },
    },
  })
  .then((data) => console.log(data, "data"))
  .catch();

// query().then({ console.log()})
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const myArgs = process.argv.slice(2);

async function run() {
  if (!(await client.indices.exists({ index: ELASTIC_INDEX.TRANSACTIONS }))) {
    await client.indices.create({
      index: ELASTIC_INDEX.TRANSACTIONS,
    });
  }

  let dataList = [];
  const game = [
    "softswiss:AllLuckyClover",
    "softswiss:AllLuckyClover100",
    "softswiss:AllLuckyClover20",
    "softswiss:AllLuckyClover40",
    "softswiss:AllLuckyClover5",
    "softswiss:AlohaKingElvis",
    "softswiss:AmericanRoulette",
    "softswiss:AnonymousBonanza",
    "softswiss:Avalon",
    "softswiss:AztecMagic",
    "softswiss:AztecMagicBonanza",
    "softswiss:AztecMagicDeluxe",
    "softswiss:AztecMagicMegaways",
    "softswiss:Baccarat",
  ];

  if (parseInt(myArgs[0]) === 0) {
    await client.indices.delete({ index: ELASTIC_INDEX.TRANSACTIONS });
    console.log(
      "Data Deleted : " +
        !(await client.indices.exists({ index: ELASTIC_INDEX.TRANSACTIONS }))
    );
    process.exit(0);
  }
  const rows = parseInt(myArgs[0]) || 100;
  const user = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  bar1.start(rows, 0);
  const beforeTempBal = 0;
  let afterTempBal = 0;

  for (let index = 0; index < rows; index++) {
    afterTempBal -= 2;
    dataList.push({
      index: ELASTIC_INDEX.TRANSACTIONS,
      id: getCsvFileName(),
      modelType: "casino-transaction",
      transactionId: index + Math.random(1000),
      transactionIdString: `${index}`,
      transactionType: "win",
      user: {
        userType: "user",
        userId: 1,
        firstName: "Yatharth",
        lastName: "Upadhyay",
        username: "kkc",
        email: "yupadhyay@gammastack.com",
        walletId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      parentId: 1,
      parentType: "superadmin",
      beforeBalance: beforeTempBal,
      afterBalance: afterTempBal,
      nonCashAmount: 1000,
      amountType: 0,
      totalAmount: 5000,
      isFirstDeposit: true,
      transactionAmount: 20,
      transactionAmountPrimary: 20,
      conversionRate: 1.25,
      status: 1,
      statusValue: "completed",
      kycStatus: "PENDING",
      description: null,
      currencyCode: "EUR",
      countryCode: "IN",
      gameAggregator: "softswiss",
      gameProviderId: 1,
      gameIdentifier: Math.random().toString(36).substring(2, 15),
      gameProvider: "bgaming",
      paymentMethod: null,
      paymentTransactionId: null,
      paymentTransactionName: null,
      bonusId: null,
      sourceCurrency: null,
      targetCurrency: null,
      amountInOtherCurrencies: null,
      reindexed: false,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    if (dataList.length === 100) {
      const operations = dataList.flatMap((doc) => [
        { index: { _index: ELASTIC_INDEX.TRANSACTIONS } },
        doc,
      ]);
      await client.bulk({ refresh: true, body: operations });
      dataList = [];
    }
    bar1.increment();
  }

  const operations = dataList.flatMap((doc) => [
    { index: { _index: ELASTIC_INDEX.TRANSACTIONS } },
    doc,
  ]);
  if (operations.length !== 0) {
    await client.bulk({ refresh: true, body: operations });
  }

  bar1.stop();
  const count = await client.count({ index: ELASTIC_INDEX.TRANSACTIONS });
  console.log("count", count);
  process.exit(0);
}

run();
