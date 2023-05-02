import db from "../db/models";
import Jwt from "jsonwebtoken";
import config from "../../config/app";
import { ID } from "../utils/constant";
import { getOne } from "../services/helper/crud";
import { APP_ERROR_CODES } from "../utils/errors";

export const isMerchantAuthenticated = async (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  const tokenData = Jwt.verify(token, config.get("jwt.secretKey"));

  if (!tokenData)
    return res.status(400).json({ message: APP_ERROR_CODES.INVALID_TOKEN });

  if (tokenData.id !== ID) {
    return res.status(403).json({ message: "Merchant not found" });
  }

  req.body.siteName = (
    await getOne({ model: db.GlobalSetting, data: { key: "SITE_NAME" } })
  ).value;

  next();
};
