import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { getOne, createNewEntity } from "../helper/crud";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  masterGameSubCategoryId: {
    type: "integer",
    presence: { allowEmpty: false },
  },
  games: {
    presence: { allowEmpty: false },
  },
};

export class CreateCategoryGameService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let { masterGameSubCategoryId, games } = this.filteredArgs;

    const t = await db.sequelize.transaction();

    try {
      const checkCasinoSubCategoryExists = await getOne({
        model: db.MasterGameSubCategory,
        data: { masterGameSubCategoryId },
        include: { model: db.MasterGameCategory },
      });

      if (!checkCasinoSubCategoryExists) {
        return this.addError(
          ERRORS.BAD_DATA,
          "Sub Category " + ERROR_MSG.NOT_EXISTS
        );
      }

      if (typeof games === "string") {
        games = JSON.parse(games);
      }

      for (const game of games) {
        const checkMasterGameExists = await getOne({
          model: db.MasterCasinoGame,
          data: { masterCasinoGameId: game },
        });
        if (checkMasterGameExists) {
          const checkCategoryGame = await getOne({
            model: db.MasterGameCategory,
            data: { masterGameCategoryId: game },
          });

          if (!checkCategoryGame) {
            await createNewEntity({
              model: db.MasterGameCategory,
              data: {
                name: checkMasterGameExists.name,
                masterCasinoGameId: checkMasterGameExists.masterCasinoGameId,
                masterCasinoProviderId:
                  checkMasterGameExists.masterCasinoProviderId,
                description: checkMasterGameExists.description
                  ? checkMasterGameExists.description
                  : null,
                thumbnailUrl: checkMasterGameExists.thumbnailUrl
                  ? checkMasterGameExists.thumbnailUrl
                  : null,
                returnToPlayer: checkMasterGameExists.returnToPlayer
                  ? checkMasterGameExists.returnToPlayer
                  : null,
                wageringContribution: checkMasterGameExists.wageringContribution
                  ? checkMasterGameExists.wageringContribution
                  : null,
              },
              transaction: t,
            });
          }
        }
      }

      await t.commit();
      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS };
    } catch (error) {
      console.log(error);
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
