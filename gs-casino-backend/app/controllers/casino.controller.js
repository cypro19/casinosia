import Responder from "../../server/expressResponder";
import {
  GetGameCategoryService,
  GetGameSubCategoryService,
  GetCategoryGamesService,
  InitGameService,
  GetGameProvidersService,
  DemoGameService,
  GetFavoriteGamesService,
  GetCasinoTransactionService,
  AddFavoriteGameService,
  RemoveFavoriteGameService,
  GetAllGamesService,
} from "../services/casino";
import { userId } from "../utils/common";

export default class CasinoController {
  static async getGameCategory(req, res) {
    const getGame = await GetGameCategoryService.execute({
      ...req.body,
      ...req.query,
    });

    if (getGame.successful) {
      Responder.success(res, getGame.result);
    } else {
      Responder.failed(res, getGame.errors);
    }
  }

  static async getGameSubCategory(req, res) {
    const getGameSubCategory = await GetGameSubCategoryService.execute({
      ...req.body,
      ...req.query,
      userId: userId(req),
    });

    if (getGameSubCategory.successful) {
      Responder.success(res, getGameSubCategory.result);
    } else {
      Responder.failed(res, getGameSubCategory.errors);
    }
  }

  static async getCategoryGames(req, res) {
    const getCategoryGames = await GetCategoryGamesService.execute({
      ...req.query,
      ...req.body,
      userId: userId(req),
    });

    if (getCategoryGames.successful) {
      Responder.success(res, getCategoryGames.result);
    } else {
      Responder.failed(res, getCategoryGames.errors);
    }
  }

  static async getGameProvider(req, res) {
    const getGameProviders = await GetGameProvidersService.execute(req.body);

    if (getGameProviders.successful) {
      Responder.success(res, getGameProviders.result);
    } else {
      Responder.failed(res, getGameProviders.errors);
    }
  }

  static async initGame(req, res) {
    const gameData = await InitGameService.execute(req.body);

    if (gameData.successful) {
      Responder.success(res, gameData.result);
    } else {
      Responder.failed(res, gameData.errors);
    }
  }

  static async demoGame(req, res) {
    const gameData = await DemoGameService.execute(req.body);

    if (gameData.successful) {
      Responder.success(res, gameData.result);
    } else {
      Responder.failed(res, gameData.errors);
    }
  }

  static async addFavoriteGame(req, res) {
    const addFavorite = await AddFavoriteGameService.execute(req.body);

    if (addFavorite.successful) {
      Responder.success(res, addFavorite.result);
    } else {
      Responder.failed(res, addFavorite.errors);
    }
  }

  static async removeFavoriteGame(req, res) {
    const removeFavorite = await RemoveFavoriteGameService.execute(req.body);

    if (removeFavorite.successful) {
      Responder.success(res, removeFavorite.result);
    } else {
      Responder.failed(res, removeFavorite.errors);
    }
  }

  static async getFavoriteGame(req, res) {
    const getFavorite = await GetFavoriteGamesService.execute({
      ...req.body,
      ...req.query,
    });

    if (getFavorite.successful) {
      Responder.success(res, getFavorite.result);
    } else {
      Responder.failed(res, getFavorite.errors);
    }
  }

  static async getCasinoTransactions(req, res) {
    const getCasinoTransactions = await GetCasinoTransactionService.execute({
      ...req.body,
      ...req.query,
    });

    if (getCasinoTransactions.successful) {
      Responder.success(res, getCasinoTransactions.result);
    } else {
      Responder.failed(res, getCasinoTransactions.errors);
    }
  }

  static async getAllGames(req, res) {
    const getAllGames = await GetAllGamesService.execute({
      ...req.body,
      ...req.query,
      userId: userId(req),
    });

    if (getAllGames.successful) {
      Responder.success(res, getAllGames.result);
    } else {
      Responder.failed(res, getAllGames.errors);
    }
  }
}
