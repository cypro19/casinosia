import db from "../db/models";
import {
  PlayService,
  RollbackService,
  FreeSpinsService,
  ResponseService,
} from "../services/swissSoft";

export default class SwissSoftController {
  static async rollback(req, res, next) {
    req.transaction = await db.sequelize.transaction();
    const rollback = await RollbackService.execute(req.body, req.transaction);

    if (rollback.successful) {
      const response = rollback.result;

      await req.transaction.commit();
      if (response.code === 200) return res.status(200).json({ ...response });
      else return res.status(412).json({ ...response });
    } else {
      await req.transaction.rollback();
      const error = rollback.errors;
      return res.status(412).json(error);
    }
  }

  static async playService(req, res, next) {
    req.transaction = await db.sequelize.transaction();
    const playService = await PlayService.execute(req.body, req.transaction);

    if (playService.successful) {
      const response = playService.result;

      await req.transaction.commit();
      if (response.code === 200) return res.status(200).json({ ...response });
      else return res.status(412).json({ ...response });
    } else {
      await req.transaction.rollback();
      const error = playService.errors;
      return res.status(412).json(error);
    }
  }

  static async freeSpins(req, res, next) {
    req.transaction = await db.sequelize.transaction();
    const freeSpins = await FreeSpinsService.execute(req.body, req.transaction);

    if (freeSpins.successful) {
      await req.transaction.commit();
      const response = await ResponseService.execute({
        data: freeSpins.result,
      });
      return res.status(200).json({ ...response });
    } else {
      await req.transaction.rollback();
      const error = freeSpins.errors;
      return res.status(412).json(error);
    }
  }
}
