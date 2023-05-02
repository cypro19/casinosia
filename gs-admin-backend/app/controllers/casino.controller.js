import Responder from "../../server/expressResponder";
import {
  CreateMasterCasinoProviderService,
  GetMasterCasinoProvidersService,
  UpdateMasterCasinoProviderService,
  CreateCasinoGameService,
  GetAggregatorsService,
  CreateAggregatorService,
  GetCasinoGamesService,
  UpdateCasinoGameService,
  CreateCategoryGameService,
  UpdateCategoryGameService,
  GetCategoryGamesService,
  LoadCasinoGameService,
  CreateGameSubCategoryService,
  GetAllGameSubCategoryService,
  GetGameSubCategoryService,
  UpdateGameSubCategoryService,
  CreateGameCategoryService,
  GetAllGameCategoryService,
  UpdateMasterGameSubCategoryService,
  UpdateMasterGameCategoryService,
  UpdateGameCategoryService,
  DeleteCategoryGameService,
  OrderGameCategoryService,
  OrderSubGameCategoryService,
  OrderCategoryGamesService,
  DeleteGameSubCategoryService,
  DeleteGameCategoryService,
  GetCasinoTransactionsService,
  GetAllProvidersService,
  GetAllCasinoGamesService,
  GetFreespinGamesService,
} from "../services/casino";
import { validateFile } from "../utils/common";
import { OK } from "../utils/constant";
import { ERRORS } from "../utils/errors";

export default class CasinoController {
  static async createMasterCasinoProvider(req, res) {
    const fileCheckResponse = validateFile(res, req.file);

    if (fileCheckResponse !== OK) {
      return res
        .status(400)
        .json({ errCode: ERRORS.BAD_REQUEST, message: fileCheckResponse });
    }

    const createMasterCasinoProvider =
      await CreateMasterCasinoProviderService.execute({
        ...req.body,
        thumbnail: req.file,
      });

    if (createMasterCasinoProvider.successful) {
      Responder.success(res, createMasterCasinoProvider.result);
    } else {
      Responder.failed(res, createMasterCasinoProvider.errors);
    }
  }

  static async getMasterCasinoProvider(req, res) {
    const getMasterCasinoProvider =
      await GetMasterCasinoProvidersService.execute(req.query);

    if (getMasterCasinoProvider.successful) {
      Responder.success(res, getMasterCasinoProvider.result);
    } else {
      Responder.failed(res, getMasterCasinoProvider.errors);
    }
  }

  static async getAllProviders(req, res) {
    const getAllProviders = await GetAllProvidersService.execute();

    if (getAllProviders.successful) {
      Responder.success(res, getAllProviders.result);
    } else {
      Responder.failed(res, getAllProviders.errors);
    }
  }

  static async updateMasterCasinoProvider(req, res) {
    const fileCheckResponse = validateFile(res, req.file);

    if (fileCheckResponse !== OK) {
      return res
        .status(400)
        .json({ errCode: ERRORS.BAD_REQUEST, message: fileCheckResponse });
    }

    const updateMasterCasinoProvider =
      await UpdateMasterCasinoProviderService.execute({
        ...req.body,
        thumbnail: req.file,
      });

    if (updateMasterCasinoProvider.successful) {
      Responder.success(res, updateMasterCasinoProvider.result);
    } else {
      Responder.failed(res, updateMasterCasinoProvider.errors);
    }
  }

  static async createCasinoGame(req, res) {
    const fileCheckResponse = validateFile(res, req.file);

    if (fileCheckResponse !== OK) {
      return res
        .status(400)
        .json({ errCode: ERRORS.BAD_REQUEST, message: fileCheckResponse });
    }

    const createCasinoGame = await CreateCasinoGameService.execute({
      ...req.body,
      thumbnail: req.file,
    });

    if (createCasinoGame.successful) {
      Responder.success(res, createCasinoGame.result);
    } else {
      Responder.failed(res, createCasinoGame.errors);
    }
  }

  static async getCasinoGame(req, res) {
    const getCasinoGame = await GetCasinoGamesService.execute({
      ...req.body,
      ...req.query,
    });

    if (getCasinoGame.successful) {
      Responder.success(res, getCasinoGame.result);
    } else {
      Responder.failed(res, getCasinoGame.errors);
    }
  }

  static async getAllCasinoGame(req, res) {
    const getCasinoGames = await GetAllCasinoGamesService.execute(req.query);

    if (getCasinoGames.successful) {
      Responder.success(res, getCasinoGames.result);
    } else {
      Responder.failed(res, getCasinoGames.errors);
    }
  }

  static async updateCasinoGame(req, res) {
    const fileCheckResponse = validateFile(res, req.file);

    if (fileCheckResponse !== OK) {
      return res
        .status(400)
        .json({ errCode: ERRORS.BAD_REQUEST, message: fileCheckResponse });
    }

    const updateCasinoGame = await UpdateCasinoGameService.execute({
      ...req.body,
      thumbnail: req.file,
    });

    if (updateCasinoGame.successful) {
      Responder.success(res, updateCasinoGame.result);
    } else {
      Responder.failed(res, updateCasinoGame.errors);
    }
  }

  static async createGameSubCategory(req, res) {
    const createGameSubCategory = await CreateGameSubCategoryService.execute(
      req.body
    );

    if (createGameSubCategory.successful) {
      Responder.success(res, createGameSubCategory.result);
    } else {
      Responder.failed(res, createGameSubCategory.errors);
    }
  }

  static async getAllGameSubCategory(req, res) {
    const getAllGameSubCategory = await GetAllGameSubCategoryService.execute({
      ...req.body,
      ...req.query,
    });

    if (getAllGameSubCategory.successful) {
      Responder.success(res, getAllGameSubCategory.result);
    } else {
      Responder.failed(res, getAllGameSubCategory.errors);
    }
  }

  static async getGameSubCategory(req, res) {
    const getGameSubCategory = await GetGameSubCategoryService.execute({
      ...req.body,
      ...req.query,
    });

    if (getGameSubCategory.successful) {
      Responder.success(res, getGameSubCategory.result);
    } else {
      Responder.failed(res, getGameSubCategory.errors);
    }
  }

  static async updateGameSubCategory(req, res) {
    const updateGameSubCategory = await UpdateGameSubCategoryService.execute(
      req.body
    );

    if (updateGameSubCategory.successful) {
      Responder.success(res, updateGameSubCategory.result);
    } else {
      Responder.failed(res, updateGameSubCategory.errors);
    }
  }

  static async createCategoryGame(req, res) {
    const createCategoryGame = await CreateCategoryGameService.execute(
      req.body
    );

    if (createCategoryGame.successful) {
      Responder.success(res, createCategoryGame.result);
    } else {
      Responder.failed(res, createCategoryGame.errors);
    }
  }

  static async updateCategoryGame(req, res) {
    const fileCheckResponse = validateFile(res, req.file);

    if (fileCheckResponse !== OK) {
      return res
        .status(400)
        .json({ errCode: ERRORS.BAD_REQUEST, message: fileCheckResponse });
    }

    const updateCategoryGame = await UpdateCategoryGameService.execute({
      ...req.body,
      thumbnail: req.file,
    });

    if (updateCategoryGame.successful) {
      Responder.success(res, updateCategoryGame.result);
    } else {
      Responder.failed(res, updateCategoryGame.errors);
    }
  }

  static async getCategoryGames(req, res) {
    const getCategoryGames = await GetCategoryGamesService.execute({
      ...req.body,
      ...req.query,
    });

    if (getCategoryGames.successful) {
      Responder.success(res, getCategoryGames.result);
    } else {
      Responder.failed(res, getCategoryGames.errors);
    }
  }

  static async getAggregators(req, res) {
    const getAggregators = await GetAggregatorsService.execute(req.query);

    if (getAggregators.successful) {
      Responder.success(res, getAggregators.result);
    } else {
      Responder.failed(res, getAggregators.errors);
    }
  }

  static async createAggregator(req, res) {
    const createAggregator = await CreateAggregatorService.execute(req.body);

    if (createAggregator.successful) {
      Responder.success(res, createAggregator.result);
    } else {
      Responder.failed(res, createAggregator.errors);
    }
  }

  static async loadCasinoGame(req, res) {
    const loadCasinoGame = await LoadCasinoGameService.execute({
      gameData: req.file,
    });

    if (loadCasinoGame.successful) {
      Responder.success(res, loadCasinoGame.result);
    } else {
      Responder.failed(res, loadCasinoGame.errors);
    }
  }

  static async createGameCategory(req, res) {
    const createGameCategory = await CreateGameCategoryService.execute(
      req.body
    );

    if (createGameCategory.successful) {
      Responder.success(res, createGameCategory.result);
    } else {
      Responder.failed(res, createGameCategory.errors);
    }
  }

  static async updateGameCategory(req, res) {
    const updateGameCategory = await UpdateGameCategoryService.execute(
      req.body
    );

    if (updateGameCategory.successful) {
      Responder.success(res, updateGameCategory.result);
    } else {
      Responder.failed(res, updateGameCategory.errors);
    }
  }

  static async getFreespinGames(req, res) {
    const getFreespinGames = await GetFreespinGamesService.execute({
      ...req.body,
      ...req.query,
    });

    if (getFreespinGames.successful) {
      Responder.success(res, getFreespinGames.result);
    } else {
      Responder.failed(res, getFreespinGames.errors);
    }
  }

  static async getGameCategory(req, res) {
    const getGameCategory = await GetAllGameCategoryService.execute({
      ...req.body,
      ...req.query,
    });

    if (getGameCategory.successful) {
      Responder.success(res, getGameCategory.result);
    } else {
      Responder.failed(res, getGameCategory.errors);
    }
  }

  static async updateMasterGameSubCategory(req, res) {
    const updateMasterGameSubCategory =
      await UpdateMasterGameSubCategoryService.execute(req.body);

    if (updateMasterGameSubCategory.successful) {
      Responder.success(res, updateMasterGameSubCategory.result);
    } else {
      Responder.failed(res, updateMasterGameSubCategory.errors);
    }
  }

  static async updateMasterGameCategory(req, res) {
    const updateMasterGameCategory =
      await UpdateMasterGameCategoryService.execute(req.body);

    if (updateMasterGameCategory.successful) {
      Responder.success(res, updateMasterGameCategory.result);
    } else {
      Responder.failed(res, updateMasterGameCategory.errors);
    }
  }

  static async deleteCategoryGame(req, res) {
    const deleteCategoryGame = await DeleteCategoryGameService.execute({
      ...req.body,
      ...req.query,
    });

    if (deleteCategoryGame.successful) {
      Responder.success(res, deleteCategoryGame.result);
    } else {
      Responder.failed(res, deleteCategoryGame.errors);
    }
  }

  static async orderGameCategory(req, res) {
    const orderGameCategory = await OrderGameCategoryService.execute(req.body);

    if (orderGameCategory.successful) {
      Responder.success(res, orderGameCategory.result);
    } else {
      Responder.failed(res, orderGameCategory.errors);
    }
  }

  static async orderSubGameCategory(req, res) {
    const orderSubGameCategory = await OrderSubGameCategoryService.execute(
      req.body
    );

    if (orderSubGameCategory.successful) {
      Responder.success(res, orderSubGameCategory.result);
    } else {
      Responder.failed(res, orderSubGameCategory.errors);
    }
  }

  static async orderCategoryGames(req, res) {
    const orderCategoryGame = await OrderCategoryGamesService.execute(req.body);

    if (orderCategoryGame.successful) {
      Responder.success(res, orderCategoryGame.result);
    } else {
      Responder.failed(res, orderCategoryGame.errors);
    }
  }

  static async deleteGameSubCategory(req, res) {
    const deleteGameSubCategory = await DeleteGameSubCategoryService.execute(
      req.body
    );

    if (deleteGameSubCategory.successful) {
      Responder.success(res, deleteGameSubCategory.result);
    } else {
      Responder.failed(res, deleteGameSubCategory.errors);
    }
  }

  static async deleteGameCategory(req, res) {
    const deleteGameCategory = await DeleteGameCategoryService.execute(
      req.body
    );

    if (deleteGameCategory.successful) {
      Responder.success(res, deleteGameCategory.result);
    } else {
      Responder.failed(res, deleteGameCategory.errors);
    }
  }

  static async getCasinoTransactions(req, res) {
    const getCasinoTransactions = await GetCasinoTransactionsService.execute({
      ...req.body,
      ...req.query,
    });

    if (getCasinoTransactions.successful) {
      if (getCasinoTransactions.result.csv) {
        res.header("Content-Type", "text/csv");
        res.attachment(getCasinoTransactions.result.fileName);
        return res.send(getCasinoTransactions.result.csvData);
      }
      Responder.success(res, getCasinoTransactions.result);
    } else {
      Responder.failed(res, getCasinoTransactions.errors);
    }
  }
}
