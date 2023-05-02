import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { cronQueue } from "../../queues/cron.queue";

/**
 *
 *
 * @export
 * @class DashboardController
 */
export default class DashboardController {
  /**
   *
   *
   * @static
   * @return {object}
   * @memberof DashboardController
   */
  static dashboard() {
    const serverAdapter = new ExpressAdapter();
    createBullBoard({
      queues: [new BullAdapter(cronQueue)],
      serverAdapter: serverAdapter,
    });

    serverAdapter.setBasePath("/dashboard");
    return serverAdapter.getRouter();
  }
}
