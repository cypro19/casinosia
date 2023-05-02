import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { getOne, updateEntity } from "../helper/crud";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { uploadLogo, getKey } from "../../utils/common";

const constraints = {
  masterCasinoGameId: {
    format: {
      pattern: "^[0-9]+$",
      flags: "i",
      message: "can only be Integer.",
    },
    presence: { allowEmpty: false },
  },
  name: {
    length: {
      minimum: 1,
      maximum: 200,
    },
    presence: { allowEmpty: false },
  },
  operatorStatus: {
    inclusion: {
      within: ["true", "false"],
      message: "can be true or false",
    },
    presence: false,
  },
  isActive: {
    inclusion: {
      within: ["true", "false"],
      message: "can be true or false",
    },
    presence: false,
  },
  masterCasinoProviderId: {
    format: {
      pattern: "^[0-9]+$",
      flags: "i",
      message: "can only be Integer.",
    },
    presence: { allowEmpty: false },
  },
  masterGameSubCategoryId: {
    format: {
      pattern: "^[0-9]+$",
      flags: "i",
      message: "can only be Integer.",
    },
    presence: { allowEmpty: false },
  },
  thumbnail: {
    presence: false,
  },
  devices: {
    presence: { allowEmpty: false },
  },
  featureGroup: {
    presence: { allowEmpty: false },
  },
  moreDetails: {
    presence: { allowEmpty: false },
  },
  restrictions: {
    presence: false,
  },
  description: {
    presence: false,
  },
  theme: {
    presence: { allowEmpty: false },
  },
  lines: {
    presence: false,
  },
  payout: {
    presence: false,
  },
  volatilityRating: {
    presence: false,
  },
  identifier: {
    presence: { allowEmpty: false },
  },
  hasFreespins: {
    presence: false,
  },
};

export class UpdateCasinoGameService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const {
      masterCasinoGameId,
      name,
      masterCasinoProviderId,
      masterGameSubCategoryId,
      thumbnail,
      isActive,
      operatorStatus,
      identifier,
      devices,
      restrictions,
      featureGroup,
      moreDetails,
      description,
      theme,
      lines,
      payout,
      volatilityRating,
      hasFreespins,
    } = this.filteredArgs;

    const t = await db.sequelize.transaction();

    try {
      const checkGameExists = await getOne({
        model: db.MasterCasinoGame,
        data: { masterCasinoGameId },
      });

      if (!checkGameExists)
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.NOT_FOUND);

      if (
        checkGameExists.masterCasinoProviderId !==
          parseInt(masterCasinoProviderId) ||
        checkGameExists.name !== name ||
        checkGameExists.masterGameSubCategoryId !==
          parseInt(masterGameSubCategoryId)
      ) {
        const gameExists = await getOne({
          model: db.MasterCasinoGame,
          data: { name, masterCasinoProviderId, masterGameSubCategoryId },
        });

        if (gameExists) {
          return this.addError(
            ERRORS.BAD_DATA,
            "Casino game " + ERROR_MSG.EXISTS
          );
        }

        const checkProviderExists = await getOne({
          model: db.MasterCasinoProvider,
          data: { masterCasinoProviderId },
        });

        if (!checkProviderExists) {
          return this.addError(
            ERRORS.BAD_DATA,
            "Casino Provider " + ERROR_MSG.NOT_EXISTS
          );
        }

        const checkSubGameExists = await getOne({
          model: db.MasterGameSubCategory,
          data: { masterGameSubCategoryId },
        });

        if (!checkSubGameExists) {
          return this.addError(
            ERRORS.BAD_DATA,
            "Game Sub Category " + ERROR_MSG.NOT_EXISTS
          );
        }
      }

      let updateData = {
        name,
        masterCasinoProviderId,
        masterGameSubCategoryId,
        isActive,
        operatorStatus,
        identifier,
        devices,
        restrictions,
        featureGroup,
        moreDetails,
        description,
        theme,
        volatilityRating,
      };

      if (lines) updateData = { ...updateData, lines };
      if (payout) updateData = { ...updateData, payout };
      if (hasFreespins) updateData = { ...updateData, hasFreespins };

      if (thumbnail && typeof thumbnail === "object") {
        const fileName = `${
          process.env.NODE_ENV
        }/master_casino_game_thumbnail/${
          checkGameExists.masterCasinoGameId
        }-${Date.now()}.${thumbnail.mimetype.split("/")[1]}`;

        const key = getKey(checkGameExists.dataValues.thumbnailUrl);
        const s3Object = await uploadLogo(thumbnail, fileName, key);

        updateData = { ...updateData, thumbnailUrl: s3Object.Location };
      }

      const updatedCasinoGame = await updateEntity({
        model: db.MasterCasinoGame,
        values: { masterCasinoGameId },
        data: updateData,
        transaction: t,
      });

      await t.commit();
      return { updatedCasinoGame, message: SUCCESS_MSG.UPDATE_SUCCESS };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
