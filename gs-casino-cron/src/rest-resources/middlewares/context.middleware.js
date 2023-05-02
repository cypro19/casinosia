import { v4 as uuid } from "uuid";
import Logger from "../../libs/logger";
import socketEmitter from "../../libs/socketEmitter";

/**
 *
 * @export
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * It will create a context for each request the context will hold things like
 * traceId - id of the request
 * sequelize - sequelize database connection
 * dbModels - all sequelize models
 * logger - logger instance
 * socketEmitter - socket emitter for emitting data directly
 *
 * It will also start the transaction and at the end of the response it will commit it or rollback as per the data
 */
export default async function contextMiddleware(req, res, next) {
  const context = {};
  context.req = req;
  context.reqTimeStamp = Date.now();
  context.traceId = uuid();
  context.logger = Logger;
  context.socketEmitter = socketEmitter;

  req.context = context;
  next();
}
