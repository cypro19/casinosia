import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { getOne, updateEntity } from "../helper/crud";
import { uploadLogo, getKey } from "../../utils/common";

const constraints = {
  masterCasinoProviderId: {
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
  isActive: {
    inclusion: {
      within: ["true", "false"],
      message: "can be true or false",
    },
    presence: false,
  },
  thumbnail: {
    presence: false,
  },
};

export class UpdateMasterCasinoProviderService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { masterCasinoProviderId, name, isActive, thumbnail } =
      this.filteredArgs;

    const t = await db.sequelize.transaction();

    try {
      const checkProviderExists = await getOne({
        model: db.MasterCasinoProvider,
        data: { masterCasinoProviderId },
      });

      if (!checkProviderExists) {
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.NOT_FOUND);
      }

      if (checkProviderExists.name !== name) {
        const nameExists = await getOne({
          model: db.MasterCasinoProvider,
          data: { name },
        });

        if (nameExists) {
          return this.addError(
            ERRORS.BAD_DATA,
            "Casino provider name " + ERROR_MSG.EXISTS
          );
        }
      }

      let updateData = { name, isActive };

      if (thumbnail && typeof thumbnail === "object") {
        const fileName = `${process.env.NODE_ENV}/casino_provider_thumbnail/${
          checkProviderExists.masterCasinoProviderId
        }-${Date.now()}.${thumbnail.mimetype.split("/")[1]}`;

        let key;

        if (checkProviderExists.dataValues.thumbnailUrl) {
          key = getKey(checkProviderExists.dataValues.thumbnailUrl);
        }

        const s3Object = await uploadLogo(thumbnail, fileName, key);
        updateData = { ...updateData, thumbnailUrl: s3Object.Location };
      }

      const updatedCasinoProvider = await updateEntity({
        model: db.MasterCasinoProvider,
        values: { masterCasinoProviderId },
        data: updateData,
        transaction: t,
      });

      await t.commit();
      return { updatedCasinoProvider, message: SUCCESS_MSG.UPDATE_SUCCESS };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
