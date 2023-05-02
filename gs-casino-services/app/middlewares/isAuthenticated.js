import CryptoJS from "crypto-js";
import config from "../../config/app";
import encode from "crypto-js/enc-hex";
import { ERROR_MSG } from "../utils/responseMessage";

export const isAuthenticated = async (req, res, next) => {
  const token = CryptoJS.HmacSHA256(
    JSON.stringify(req.body),
    config.get("swissSoft.accessToken")
  ).toString(encode);

  if (token !== req.headers["x-request-sign"]) {
    return res.status(403).json({
      code: 403,
      message: ERROR_MSG.TOKEN_INVALID,
    });
  }

  next();
};
