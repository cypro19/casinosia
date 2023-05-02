import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { getOne, createNewEntity, updateEntity } from "../helper/crud";
import { uploadLogo } from "../../utils/common";

const constraints = {
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
  masterGameAggregatorId: {
    presence: false,
  },
  thumbnail: {
    presence: false,
  },
};

export class CreateMasterCasinoProviderService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { name, isActive, masterGameAggregatorId, thumbnail } =
      this.filteredArgs;

    const t = await db.sequelize.transaction();

    try {
      let query;
      if (masterGameAggregatorId) query = { masterGameAggregatorId };

      const checkProviderExists = await getOne({
        model: db.MasterCasinoProvider,
        data: { ...query, name },
      });

      if (checkProviderExists) {
        return this.addError(
          ERRORS.BAD_DATA,
          "Casino Provider " + ERROR_MSG.EXISTS
        );
      }

      let data = { name, isActive };

      if (masterGameAggregatorId) {
        const checkAggregatorExist = await getOne({
          model: db.MasterGameAggregator,
          data: { masterGameAggregatorId },
        });

        data = { ...data, masterGameAggregatorId };

        if (!checkAggregatorExist)
          return this.addError(
            ERRORS.BAD_DATA,
            "Game Aggregator " + ERROR_MSG.NOT_EXISTS
          );
      }

      const createCasinoProvider = await createNewEntity({
        model: db.MasterCasinoProvider,
        data: data,
        transaction: t,
      });

      if (thumbnail) {
        const fileName = `${process.env.NODE_ENV}/casino_provider_thumbnail/${
          createCasinoProvider.masterCasinoProviderId
        }-${Date.now()}.${thumbnail.mimetype.split("/")[1]}`;

        const { Location } = await uploadLogo(thumbnail, fileName);

        await updateEntity({
          model: db.MasterCasinoProvider,
          values: {
            masterCasinoProviderId: createCasinoProvider.masterCasinoProviderId,
          },
          data: { thumbnailUrl: Location },
          transaction: t,
        });

        createCasinoProvider.thumbnailUrl = Location;
      }

      await t.commit();
      return { createCasinoProvider, message: SUCCESS_MSG.CREATE_SUCCESS };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
