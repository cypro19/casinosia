import axios from "axios";
import config from "../../../config/app";
import { secureData } from "./casino";

export const liveUpdateWallet = async ({
  userId,
  userUuid,
  cash,
  nonCash,
  wagering,
  wageredAmount,
  level,
  loyaltyPoints,
  amountToWager,
  wageringStatus,
  limitTable,
}) => {
  try {
    const updateWalletURL = `${config.get(
      "userBeUrl"
    )}/api/user/live-update-wallet`;
    const payload = {
      userId,
      userUuid,
      cash,
      nonCash,
      wagering,
      wageredAmount,
      level,
      loyaltyPoints,
      wageringStatus,
      amountToWager,
      limitTable,
    };
    const token = secureData({
      data: payload,
      key: config.get("microService.accessToken"),
    });

    const response = await axios.post(updateWalletURL, payload, {
      headers: { "MICRO-SERVICE-REQUEST-SIGN": token },
    });

    if (response.data.success) return true;
    return false;
  } catch {
    return false;
  }
};
