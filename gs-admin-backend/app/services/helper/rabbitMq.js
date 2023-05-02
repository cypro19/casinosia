import _ from "lodash";
import amqp from "amqplib/callback_api";
import logger from "../../common/logger";
import { getDetails } from "../../utils/common";
import { TRANSACTION_STATUS, ACCOUNT_TYPE } from "../../utils/constant";

let connection = null;
const exchange = "DataWarehouse";

export const createConnection = async (key, data) => {
  if (process.env.NODE_ENV === "staging") {
    try {
      await amqp.connect(
        process.env.RMQ_CONN_URL,
        async function (error, conn) {
          logger.info("Connection Established");

          if (error) {
            logger.error("Connection Error");
          } else {
            connection = conn;
            await publishToQueue(exchange, key, data);
          }
        }
      );
    } catch (error) {
      logger.error("Error", error);
    }
  }
};

export const publishToQueue = async (exchange, routingKey, data) => {
  const channel = await connection.createChannel();

  await channel.assertExchange(exchange, "direct", { durable: true });
  channel.publish(
    exchange,
    routingKey,
    Buffer.from(JSON.stringify([data]).toString())
  );
};

export const walletObject = async (details) => {
  const detail = await getDetails({ currency: details.currencyCode });

  const detailObject = {
    id: details.transactionId,
    brand: details?.domainName,
    playerid: details.targetId,
    transactionType: details.transactionType,
    creation_date: details.transactionDateTime,
    processed_date: details.transactionDateTime,
    amount: Math.abs(details.amount),
    currency: details.currencyCode,
    currency_id: detail.currencyId,
    rate_to_euro: details.conversionRate,
    transaction_status: _.findKey(
      TRANSACTION_STATUS,
      (value) => value === details.status
    ),
    paymentprovider_name: details.moreDetails?.provider,
    paymentmethod_name: details.paymentMethod,
    updated_at: details.updatedAt,
  };

  return detailObject;
};

export const customerObject = async (details) => {
  const detail = await getDetails({
    currency: details.currencyCode,
    country: details.countryCode,
  });

  const detailObject = {
    playerid: details.userId,
    brand: details?.domainName,
    username: details.username,
    phone: details.phone,
    email: details.email,
    first_name: details.firstName,
    last_name: details.lastName,
    verification_status: details.kycStatus,
    accountType: ACCOUNT_TYPE,
    created_at: details.createdAt,
    affiliate_id: details.affiliateId,
    last_login_at: details.lastLoginDate,
    balance: Math.abs(details.userWallet.amount),
    birthday: details.dateOfBirth,
    gender: details.gender,
    city: details.city,
    currency_id: detail.currencyId,
    currency: details.currencyCode,
    countryName: detail.countryName,
    language: details.locale,
    register_ip: details.signInIp,
    notes: { tags: details.tags },
    updated_at: details.updatedAt,
    zip: details.zipCode,
  };

  return detailObject;
};

export const bonusObject = async (details) => {
  let detail;
  if (details?.transaction)
    detail = await getDetails({ currency: details?.transaction?.currencyCode });

  const detailObject = {
    id: details.uniqueId,
    palyerid: details.userId,
    bonus_type: details.bonusType,
    bonus_id: details.bonusId,
    bonus_name: details?.bonus?.promotionTitle,
    wagered_amount: details.wageredAmount,
    wagered_threshold: details.amountToWager,
    bonus_balance: 0,
    valid_until: details.expireAt,
    creation_date: details.claimedAt,
    brand: details?.domainName,
    amount: details.bonusAmount,
    deposit_amount: details?.depositAmount,
    currency: details?.transaction?.currencyCode,
    currency_id: detail?.currencyId,
    rate_to_euro: details?.transaction?.conversionRate,
    bonus_status: details.status,
    notes: {
      userBonusId: details.userBonusId,
      wageringStatus: details.wageringStatus,
      freeSpinsQty: details.freeSpinsQty,
      games: details.games,
      betLevel: details.betLevel,
    },
    updated_at: details.updatedAt,
  };

  return detailObject;
};
