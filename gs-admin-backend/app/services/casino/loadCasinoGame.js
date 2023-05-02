import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { GAME_CATEGORY } from "../../utils/constant";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { createNewEntity, getOne, updateEntity } from "../helper/crud";
import { Op } from "sequelize";

const constraints = {
  gameData: {
    presence: { allowEmpty: false },
  },
};

export class LoadCasinoGameService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { gameData } = this.filteredArgs;

    try {
      if (
        typeof gameData === "object" &&
        gameData.mimetype.split("/")[1] === "yaml"
      ) {
        const yaml = require("js-yaml");
        const games = yaml.load(gameData.buffer);

        const checkCategoryExists = await getOne({
          model: db.MasterGameCategory,
          data: { name: { [Op.contains]: { EN: GAME_CATEGORY.CASINO_GAME } } },
        });
        let categoryId = checkCategoryExists?.masterGameCategoryId;

        if (!checkCategoryExists) {
          const createCategory = await createNewEntity({
            model: db.MasterGameCategory,
            data: { name: { EN: GAME_CATEGORY.CASINO_GAME }, orderId: 1 },
          });
          categoryId = createCategory.masterGameCategoryId;
        }

        const RestrictedCountries = [];

        let indexOrder = 1;
        for (const game of games) {
          const checkGameExists = await getOne({
            model: db.MasterCasinoGame,
            data: { identifier: game.identifier },
          });
          if (checkGameExists) {
            continue;
          }

          if (game !== null) {
            const checkProviderExists = await getOne({
              model: db.MasterCasinoProvider,
              data: { name: game.producer },
            });
            let providerId = checkProviderExists?.masterCasinoProviderId;

            if (!checkProviderExists) {
              const checkAggregatorExists = await getOne({
                model: db.MasterGameAggregator,
                data: { name: game.provider },
              });
              let aggregatorId = checkAggregatorExists?.masterGameAggregatorId;

              if (!checkAggregatorExists) {
                const createAggregator = await createNewEntity({
                  model: db.MasterGameAggregator,
                  data: { name: game.provider },
                });
                aggregatorId = createAggregator.masterGameAggregatorId;
              }

              const createCasinoProvider = await createNewEntity({
                model: db.MasterCasinoProvider,
                data: {
                  name: game.producer,
                  masterGameAggregatorId: aggregatorId,
                  thumbnailUrl: `${process.env.SWISS_SOFT_PROVIDER_LOGO}color/${game.producer}.svg`,
                },
              });
              providerId = createCasinoProvider.masterCasinoProviderId;
            }

            const checkSubCategoryExists = await getOne({
              model: db.MasterGameSubCategory,
              data: { name: { [Op.contains]: { EN: game.category } } },
            });
            let subCategoryId = checkSubCategoryExists?.masterGameSubCategoryId;

            if (!checkSubCategoryExists) {
              const createSubCategory = await createNewEntity({
                model: db.MasterGameSubCategory,
                data: {
                  name: { EN: game.category },
                  masterGameCategoryId: categoryId,
                  orderId: indexOrder++,
                },
              });
              subCategoryId = createSubCategory?.masterGameSubCategoryId;
            }

            const {
              title,
              identifier,
              devices,
              restrictions,
              feature_group,
              description,
              theme,
              lines,
              payout,
              has_freespins,
              volatility_rating,
              provider,
              identifier2,
              category,
              producer,
              ...more_details
            } = game;

            let newGame = {
              name: game.title,
              masterCasinoProviderId: providerId,
              masterGameSubCategoryId: subCategoryId,
              thumbnailUrl: `${process.env.SWISS_SOFT_BASE_URL}${game.provider}/${game.identifier2}.png`,
              isActive: true,
              identifier: game.identifier,
              operatorStatus: true,
              devices: game.devices,
              restrictions: game.restrictions,
              featureGroup: game.feature_group,
              moreDetails: more_details,
              description: game.description,
              theme: game.theme,
              lines: game.lines,
              hasFreespins: game.has_freespins,
              volatilityRating: game.volatility_rating,
            };

            if (game.payout) {
              newGame = { ...newGame, returnToPlayer: game.payout };
            }

            const newGameCreated = await createNewEntity({
              model: db.MasterCasinoGame,
              data: newGame,
            });
            for (const country of game.restrictions.default["blacklist"]) {
              if (country in RestrictedCountries) {
                RestrictedCountries[country].push(
                  newGameCreated.masterCasinoGameId
                );
              } else {
                RestrictedCountries[country] = [
                  newGameCreated.masterCasinoGameId,
                ];
              }
            }
          }
        }

        for (const country in RestrictedCountries) {
          const checkCountryExists = await getOne({
            model: db.Country,
            data: { code: country },
          });
          if (!checkCountryExists)
            return this.addError(ERRORS.BAD_DATA, ERROR_MSG.NOT_FOUND);

          if (checkCountryExists.restrictedGames) {
            checkCountryExists.restrictedGames.push(
              RestrictedCountries[country]
            );
          } else {
            checkCountryExists.restrictedGames = RestrictedCountries[country];
          }
          const dataItem = {
            restrictedGames: [...new Set(checkCountryExists.restrictedGames)],
          };

          await updateEntity({
            model: db.Country,
            values: { countryId: checkCountryExists.countryId },
            data: dataItem,
          });
        }

        return { games, message: SUCCESS_MSG.CREATE_SUCCESS };
      }
      return true;
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
