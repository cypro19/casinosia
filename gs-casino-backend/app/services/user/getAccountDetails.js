import axios from "axios";
import db from "../../db/models";
import { getOne } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  id: {
    presence: { allowEmpty: false },
  },
};

export class GetAccountDetailService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { id } = this.filteredArgs;

    try {
      const walletId = await getOne({
        model: db.Wallet,
        data: { ownerId: id },
        attributes: ["walletId"],
      });

      const payload = {
        casino_id: process.env.SWISS_SOFT_CASINO_ID,
        account_id: walletId,
      };

      let gameData;
      try {
        gameData = await axios.post(
          `${process.env.SWISS_SOFT_GCP_URL}/accounts/details`,
          payload
        );
      } catch {
        return this.addError(ERRORS.BAD_REQUEST, ERROR_MSG.EXTERNAL_API_ERROR);
      }

      if (!gameData)
        return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND);

      return { gameData: gameData.data, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
