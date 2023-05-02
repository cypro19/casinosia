import db from "../db/models";
import config from "../../config/app";
import { ERROR_MSG, ERRORS } from "../utils/errors";
import { getOne } from "../services/helper/crud";

export const checkDomain = async (req, res, next) => {
  const origin = (
    await getOne({
      model: db.GlobalSetting,
      data: { key: "ORIGIN" },
    })
  ).value;

  let fromOrigin = null;

  if (req.headers && req.headers.origin) {
    fromOrigin = req.headers.origin;
  } else if (
    config.get("env") === "development" &&
    req.body &&
    req.body.domain
  ) {
    fromOrigin = req.body.domain;
  } else if (
    config.get("env") === "development" &&
    req.query &&
    req.query.domain
  ) {
    fromOrigin = req.query.domain;
  }

  if (fromOrigin !== origin) {
    return res.status(400).json({
      message: ERROR_MSG.DOMAIN_ERROR,
      errCode: ERRORS.BAD_REQUEST,
    });
  }

  req.body.origin = origin;
  req.body.siteName = (
    await getOne({ model: db.GlobalSetting, data: { key: "SITE_NAME" } })
  ).value;
  req.body.language = req.headers.language;
  req.body.ipAddress =
    req.headers["x-forwarded-for"]?.split(",").shift() ||
    req.socket?.remoteAddress ||
    req.ip;
  if (req.body.ipAddress === "::1") req.body.ipAddress = "1.1.1.1";
  next();
};
