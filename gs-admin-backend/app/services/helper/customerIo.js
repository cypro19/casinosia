import axios from "axios";
import db from "../../db/models";
import { Op } from "sequelize";
import { TrackClient, RegionUS } from "customerio-node";
import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
  AMOUNT_TYPE,
  BONUS_STATUS,
} from "../../utils/constant";

const cio = new TrackClient(process.env.SITE_ID, process.env.TRACK_API_KEY, {
  region: RegionUS,
});

export const insertUpdate = (id, data) => {
  if (process.env.NODE_ENV === "staging") cio.identify(id, data);
};

export const getData = async (id) => {
  const data = await axios.get(
    `https://api.customer.io/v1/customers/${id}/attributes?id_type=id`,
    {
      headers: {
        Authorization: `Bearer ${process.env.APP_API_KEY}`,
      },
    }
  );

  const value = data.data.customer;
  delete value.timestamps;

  return value;
};

export const event = (id, data) => {
  if (process.env.NODE_ENV === "staging") cio.track(id, data);
};

export const totalBonus = async (userId) => {
  const total = await db.TransactionBanking.sum("amount", {
    where: {
      targetId: userId,
      amountType: AMOUNT_TYPE.NON_CASH,
      status: TRANSACTION_STATUS.SUCCESS,
      transactionType: TRANSACTION_TYPE.BONUS,
    },
  });

  const count = await db.UserBonus.count({
    where: {
      userId,
      status: { [Op.notIn]: [BONUS_STATUS.PENDING, BONUS_STATUS.CLAIMING] },
    },
  });

  return { total, count };
};
