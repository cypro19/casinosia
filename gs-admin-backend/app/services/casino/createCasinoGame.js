import db from "../../db/models";
import { uploadLogo } from "../../utils/common";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { createNewEntity, getOne, updateEntity } from "../helper/crud";

const constraints = {
  name: {
    length: {
      minimum: 1,
      maximum: 200,
    },
    presence: { allowEmpty: false },
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
  isActive: {
    inclusion: {
      within: ["true", "false"],
      message: "can be true or false",
    },
    presence: false,
  },
  operatorStatus: {
    inclusion: {
      within: ["true", "false"],
      message: "can be true or false",
    },
    presence: false,
  },
  thumbnail: {
    presence: { allowEmpty: false },
  },
  devices: {
    presence: { allowEmpty: false },
  },
  theme: {
    presence: false,
  },
  featureGroup: {
    presence: false,
  },
  moreDetails: {
    presence: { allowEmpty: false },
  },
  description: {
    presence: false,
  },
  restrictions: {
    presence: false,
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

export class CreateCasinoGameService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const {
      name,
      masterCasinoProviderId,
      thumbnail,
      isActive,
      operatorStatus,
      identifier,
      masterGameSubCategoryId,
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

      const checkGameExists = await getOne({
        model: db.MasterCasinoGame,
        data: { name, masterCasinoProviderId },
      });

      if (checkGameExists) {
        return this.addError(
          ERRORS.BAD_DATA,
          "Casino game " + ERROR_MSG.EXISTS
        );
      }

      const checkGameCategoryExists = await getOne({
        model: db.MasterGameSubCategory,
        data: { masterGameSubCategoryId },
      });

      if (!checkGameCategoryExists) {
        return this.addError(
          ERRORS.BAD_DATA,
          "Game sub category " + ERROR_MSG.NOT_EXISTS
        );
      }

      let data = {
        name,
        masterCasinoProviderId,
        masterGameSubCategoryId,
        isActive,
        identifier,
        operatorStatus,
        devices,
        restrictions,
        featureGroup,
        moreDetails,
        description,
        theme,
        volatilityRating,
      };

      if (lines) data = { ...data, lines };
      if (payout) data = { ...data, payout };
      if (hasFreespins) data = { ...data, hasFreespins };

      const createGame = await createNewEntity({
        model: db.MasterCasinoGame,
        data: data,
        transaction: t,
      });

      const fileName = `${process.env.NODE_ENV}/casino_game_thumbnail/${
        createGame.masterCasinoGameId
      }-${Date.now()}.${thumbnail.mimetype.split("/")[1]}`;

      const { Location } = await uploadLogo(thumbnail, fileName);

      await updateEntity({
        model: db.MasterCasinoGame,
        values: { masterCasinoGameId: createGame.masterCasinoGameId },
        data: { thumbnailUrl: Location },
        transaction: t,
      });

      createGame.thumbnailUrl = Location;

      await t.commit();
      return { createGame, message: SUCCESS_MSG.CREATE_SUCCESS };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
