import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { getOne, updateEntity } from "../helper/crud";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { uploadLogo, getKey } from "../../utils/common";

const constraints = {
  masterGameCategoryId: {
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
    presence: { allowEmpty: false },
  },
  user: {
    presence: { allowEmpty: false },
  },
  thumbnail: {
    presence: false,
  },
  description: {
    presence: false,
  },
  name: {
    presence: { allowEmpty: false },
  },
};

export class UpdateCategoryGameService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const {
      masterGameCategoryId,
      isActive,
      masterGameSubCategoryId,
      thumbnail,
      user,
      description,
      name,
    } = this.filteredArgs;

    const t = await db.sequelize.transaction();

    try {
      const checkCategoryGameExists = await getOne({
        model: db.MasterGameCategory,
        data: { masterGameCategoryId },
      });

      if (!checkCategoryGameExists)
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.NOT_FOUND);

      if (
        checkCategoryGameExists.masterGameSubCategoryId !==
          parseInt(masterGameSubCategoryId) ||
        checkCategoryGameExists.name !== name
      ) {
        const checkGameExists = await getOne({
          model: db.MasterGameCategory,
          data: { name, masterGameCategoryId },
        });

        if (checkGameExists)
          return this.addError(
            ERRORS.BAD_DATA,
            "Category game " + ERROR_MSG.EXISTS
          );

        const checkCategoryExists = await getOne({
          model: db.MasterGameSubCategory,
          data: { masterGameSubCategoryId },
          include: [{ model: db.MasterGameCategory }],
        });

        if (!checkCategoryExists)
          return this.addError(
            ERRORS.BAD_DATA,
            "Casino Sub Category " + ERROR_MSG.NOT_EXISTS
          );
      }

      let updateData = { isActive, masterGameSubCategoryId, description, name };

      if (thumbnail && typeof thumbnail === "object") {
        const fileName = `${
          process.env.NODE_ENV
        }/casino_category_game_thumbnail/${
          checkCategoryGameExists.categoryGameId
        }-${Date.now()}.${thumbnail.mimetype.split("/")[1]}`;

        let key;

        if (checkCategoryGameExists.dataValues.thumbnailUrl) {
          key = getKey(checkCategoryGameExists.dataValues.thumbnailUrl);
        }

        const s3Object = await uploadLogo(thumbnail, fileName, key);
        updateData = { ...updateData, thumbnailUrl: s3Object.Location };
      }

      const updatedCategoryGame = await updateEntity({
        model: db.MasterGameCategory,
        data: updateData,
        values: { masterGameCategoryId },
        transaction: t,
      });

      await t.commit();
      return { updatedCategoryGame, message: SUCCESS_MSG.UPDATE_SUCCESS };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
