import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { getOne, deleteEntity } from "../helper/crud";

const constraints = {
  gameId: {
    presence: { allowEmpty: false },
  },
  id: {
    presence: { allowEmpty: false },
  },
};

export class RemoveFavoriteGameService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { gameId, id } = this.filteredArgs;

    try {
      const checkFavoriteGameExists = await getOne({
        model: db.FavoriteGame,
        data: { masterCasinoGameId: gameId, userId: id },
        attributes: ["userId"],
        raw: true,
      });

      if (!checkFavoriteGameExists) {
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.NOT_FOUND);
      }

      await deleteEntity({
        model: db.FavoriteGame,
        values: { masterCasinoGameId: gameId, userId: id },
      });

      return { success: true, message: SUCCESS_MSG.REMOVE_FAVORITE };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
