import CryptoJS from "crypto-js";
import config from "../../config/app";
import encode from "crypto-js/enc-hex";
import { APP_ERROR_CODES, ERROR_MSG } from "../utils/errors";

export const validateSignature = async (req, res, next) => {
  const token = CryptoJS.HmacMD5(
    req.body,
    config.get("microService.accessToken")
  ).toString(encode);

  if (token !== req.headers["micro-service-request-sign"]) {
    return res.status(400).json({
      success: false,
      message: ERROR_MSG.TOKEN_INVALID,
      errCode: APP_ERROR_CODES.INVALID_TOKEN,
    });
  }

  next();
};
