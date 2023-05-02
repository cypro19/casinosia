import fs from "fs";
import db from "../db/models";
import { Parser } from "json2csv";
import Logger from "../libs/logger";
import config from "../configs/app.config";
import path from "path";

const defaultUserObject = (userId) => {
  return {
    date: new Date().toISOString().substring(0, 10),
    player_id: userId,
    casino_cost_bonus: 0,
    forfeited_bonuses: 0,
    cash_casino_cost_freeround: 0,
    non_cash_casino_cost_freeround: 0,
    casino_bets: 0,
    casino_wins: 0,
    casino_bonus_bets: 0,
    casino_bonus_wins: 0,
    casino_ngr: 0,
    deposits: 0,
    withdrawals: 0,
    depositBonus: 0,
    chargeback: 0,
    money_added: 0,
    money_retracted: 0,
    non_cash_money_added: 0,
    non_cash_money_retracted: 0,
    ftd_amount: 0,
    total_ngr: 0,
    jackpot_countribution_bets: 0,
    jackpot_countribution_wins: 0,
  };
};

export const getSftpConnection = async () => {
  const SftpClient = require("ssh2-sftp-client");

  const sftpConfig = {
    host: config.get("myAffiliateFTP.host"),
    port: config.get("myAffiliateFTP.port"),
    user: config.get("myAffiliateFTP.user"),
    password: config.get("myAffiliateFTP.password"),
  };

  try {
    const sftp = new SftpClient("myAffiliate-client");
    await sftp.connect(sftpConfig);

    sftp.myAffiliateRemotePath = await sftp.cwd();
    sftp.myAffiliateRemoteFiles = await sftp.list(sftp.myAffiliateRemotePath);

    Logger.info("SFTP", { message: "Connected to MyAffiliate FTP Server" });

    return { success: true, sftp, error: null, message: null };
  } catch (error) {
    Logger.error("SFTP", {
      message: "Error while connecting to MyAffiliate FTP Server",
      exception: error,
    });
    return {
      success: false,
      sftp: null,
      error,
      message: "Error while connecting to MyAffiliate FTP Server",
    };
  }
};

const getCsvFileName = async () => {
  const name = (
    await db.GlobalSetting.findOne({ where: { key: "SITE_NAME" } })
  ).value.replaceAll(" ", "");

  return (
    name.toLowerCase() + `_${new Date().toISOString().substring(0, 10)}.csv`
  );
};

const convertToCsv = ({ fields, data }) => {
  const json2csv = new Parser({ fields });
  const csv = json2csv.parse(data);

  return csv;
};

const createAffiliateCsv = async (csvObject) => {
  if (!Object.keys(csvObject).length) {
    Logger.info("Csv worker", { message: "No data found to upload" });
    return { success: true, data: "No data found to upload", error: null };
  }
  const apiResponse = csvObject;
  const { success, sftp, error, message } = await getSftpConnection();

  if (!success) return { success, data: csvObject, error, message };

  const fileName = await getCsvFileName();
  const fields = Object.keys(Object.values(csvObject)[0]);
  const data = Object.values(csvObject);
  const csvData = convertToCsv({ fields, data });

  if (config.get("env") === "development") {
    // For local testing
    fs.writeFileSync(path.join("tmp", fileName), csvData);
  }

  await sftp.put(
    Buffer.from(csvData),
    sftp.myAffiliateRemotePath + `/${fileName}`
  );
  Logger.info("Csv worker", {
    message: `${fileName} uploaded successfully to My Affiliate FTP`,
  });

  if (success) {
    try {
      await sftp.end();
      Logger.info("SFTP", { message: "My Affiliate Ftp connection closed" });
    } catch (error) {
      Logger.info("SFTP", {
        message: "Unable to close My Affiliate Ftp Connection",
        exception: error,
      });
    }
  }

  return { success: true, data: apiResponse, error: null };
};

export const affiliateTransaction = async ({
  casinoTransactions,
  firstDepositAmount,
  transactions,
  bonusAmount,
}) => {
  const csvObject = {};

  // Sorting Casino related transactions user wise
  for (const casinoTransaction of casinoTransactions) {
    const userId = casinoTransaction.userId;

    if (!csvObject[userId]) csvObject[userId] = defaultUserObject(userId);

    csvObject[userId].casino_bets = parseFloat(casinoTransaction.casinoBets);
    csvObject[userId].casino_wins = parseFloat(casinoTransaction.casinoWins);
    csvObject[userId].casino_bonus_bets = parseFloat(
      casinoTransaction.casinoBonusBets
    );
    csvObject[userId].casino_bonus_wins = parseFloat(
      casinoTransaction.casinoBonusWins
    );
    csvObject[userId].cash_casino_cost_freeround = parseFloat(
      casinoTransaction.cashCasinoCostFreerounds
    );
    csvObject[userId].non_cash_casino_cost_freeround = parseFloat(
      casinoTransaction.noncashCasinoCostFreerounds
    );
  }

  // Sorting Banking related transactions user wise
  for (const transaction of transactions) {
    const userId = transaction.targetId;

    if (!csvObject[userId]) csvObject[userId] = defaultUserObject(userId);

    csvObject[userId].deposits = parseFloat(transaction.deposits);
    csvObject[userId].withdrawals = parseFloat(transaction.withdrawls);
    csvObject[userId].money_added = parseFloat(transaction.moneyAdded);
    csvObject[userId].money_retracted = parseFloat(transaction.moneyRemoved);
    csvObject[userId].non_cash_money_added = parseFloat(
      transaction.noncashMoneyAdded
    );
    csvObject[userId].non_cash_money_retracted = parseFloat(
      transaction.noncashMoneyRemoved
    );
  }

  // Sorting first deposit related transactions user wise
  for (const firstDeposit of firstDepositAmount) {
    if (firstDeposit.transactionBanking.length !== 0) {
      const userId = firstDeposit.userId;

      if (!csvObject[userId]) csvObject[userId] = defaultUserObject(userId);

      csvObject[userId].ftd_amount =
        firstDeposit.transactionBanking[0].primaryCurrencyAmount;
    }
  }

  // Sorting Bonus related transactions user wise
  for (const bonus of bonusAmount) {
    const userId = bonus.userId;

    if (!csvObject[userId]) csvObject[userId] = defaultUserObject(userId);

    csvObject[userId].forfeited_bonuses = parseFloat(
      bonus["bonus.bonusForfeitedAmount"]
    );
    csvObject[userId].depositBonus = parseFloat(bonus["bonus.depositBonus"]);
    csvObject[userId].casino_cost_bonus = parseFloat(
      bonus["bonus.casinoCostBonus"]
    );
  }

  // To Calculate casino_ngr and total_ngr for each user

  for (const userId of Object.keys(csvObject)) {
    csvObject[userId].casino_ngr = parseFloat(
      csvObject[userId].casino_bets -
        csvObject[userId].casino_wins -
        csvObject[userId].casino_cost_bonus -
        csvObject[userId].cash_casino_cost_freeround
    );

    csvObject[userId].total_ngr = csvObject[userId].casino_ngr;
  }

  Logger.info("Csv worker", { message: "Data processed" });

  return await createAffiliateCsv(csvObject);
};
