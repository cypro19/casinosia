import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { createNewEntity, getOne } from "../helper/crud";

const constraints = {
  gameId: {
    presence: { allowEmpty: false },
  },
  id: {
    presence: { allowEmpty: false },
  },
};

export class AddFavoriteGameService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { id, gameId } = this.filteredArgs;

    try {
      const checkFavoriteGameExists = await getOne({
        model: db.FavoriteGame,
        data: { masterCasinoGameId: gameId, userId: id },
        attributes: ["userId"],
        raw: true,
      });

      if (checkFavoriteGameExists) {
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.EXISTS);
      }

      await createNewEntity({
        model: db.FavoriteGame,
        data: { userId: id, masterCasinoGameId: gameId },
      });

      return { success: true, message: SUCCESS_MSG.ADD_FAVORITE };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
