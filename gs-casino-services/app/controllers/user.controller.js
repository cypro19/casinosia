import Responder from "../../server/expressResponder";
import {
  CancelFreeSpinsService,
  DemoGameService,
  InitGameService,
  IssueFreeSpinsService,
  RoundDetailsService,
} from "../services/user";

export default class UserController {
  static async demoGame(req, res) {
    const demoGame = await DemoGameService.execute({ payload: req.body });

    if (demoGame.successful) {
      Responder.success(res, demoGame.result);
    } else {
      Responder.failed(res, demoGame.errors);
    }
  }

  static async initGame(req, res) {
    const init = await InitGameService.execute({ payload: req.body });

    if (init.successful) {
      Responder.success(res, init.result);
    } else {
      Responder.failed(res, init.errors);
    }
  }

  static async issueFreeSpin(req, res) {
    const issueFreeSpin = await IssueFreeSpinsService.execute({
      payload: req.body,
    });

    if (issueFreeSpin.successful) {
      Responder.success(res, issueFreeSpin.result);
    } else {
      Responder.failed(res, issueFreeSpin.errors);
    }
  }

  static async cancelFreeSpins(req, res) {
    const cancelFreeSpins = await CancelFreeSpinsService.execute({
      payload: req.body,
    });

    if (cancelFreeSpins.successful) {
      Responder.success(res, cancelFreeSpins.result);
    } else {
      Responder.failed(res, cancelFreeSpins.errors);
    }
  }

  static async roundDetails(req, res) {
    const roundDetails = await RoundDetailsService.execute(req.body);

    if (roundDetails.successful) {
      Responder.success(res, roundDetails.result);
    } else {
      Responder.failed(res, roundDetails.errors);
    }
  }
}
