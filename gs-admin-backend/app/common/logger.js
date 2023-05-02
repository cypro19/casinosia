import fs from "fs";
import winston from "winston";
import config from "../../config/app";

require("winston-daily-rotate-file");

const { combine, timestamp, printf } = winston.format;

const logLevel = config.get("log_level");

let transports = [
  new winston.transports.Console({
    level: logLevel,
    handleExceptions: true,
    json: true,
    colorize: true,
  }),
];

const customFormat = printf((info) => {
  let msg = `Pid: ${process.pid} ${info.timestamp} ${info.level}: `;

  msg += info.logTitle ? `${info.logTitle}` : "";
  msg += info.message
    ? `${
        typeof info.message === "object"
          ? JSON.stringify(info.message)
          : info.message
      } `
    : "";
  msg += info.class
    ? `class: ${
        typeof info.class === "object" ? JSON.stringify(info.class) : info.class
      } `
    : "";
  msg += info.context
    ? `context: ${
        typeof info.context === "object"
          ? JSON.stringify(info.context)
          : info.context
      } `
    : "";
  msg += info.metadata
    ? `metadata: ${
        typeof info.metadata === "object"
          ? JSON.stringify(info.metadata)
          : info.metadata
      } `
    : "";
  msg += info.exceptionBacktrace
    ? `exceptionBacktrace: ${
        typeof info.exceptionBacktrace === "object"
          ? JSON.stringify(info.exceptionBacktrace)
          : info.exceptionBacktrace
      } `
    : "";
  msg += info.fault
    ? `fault: ${
        typeof info.fault === "object" ? JSON.stringify(info.fault) : info.fault
      } `
    : "";

  return msg;
});

const format = combine(
  winston.format.colorize(),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.prettyPrint(),
  customFormat
);

const logger = winston.createLogger({ transports, exitOnError: false, format });

export default class Logger {
  static info(logTitle, argHash) {
    this.log("info", logTitle, argHash);
  }

  static debug(logTitle, argHash) {
    this.log("debug", logTitle, argHash);
  }

  static error(logTitle, argHash) {
    this.log("error", logTitle, argHash);
  }

  static custom(type, logTitle, argHash) {
    const allArgs = { logTitle, ...argHash };
    const logMessage = this.buildMessage(allArgs);
    logger[type](logMessage);
  }

  static log(logType, logTitle, argHash) {
    const allArgs = { logTitle, ...argHash };
    const logMessage = this.buildMessage(allArgs);
    this.writeToLog(logType, logTitle, logMessage, argHash);
  }

  static writeToLog(logType, logTitle, logMessage, argHash) {
    if (argHash && ["start", "around"].indexOf(argHash.wrap) !== -1) {
      logger[logType](
        this.generateWrapStr(logTitle, "START", argHash.extraData)
      );
    } else if (argHash && ["end", "around"].indexOf(argHash.wrap) !== -1) {
      logger[logType](this.generateWrapStr(logTitle, "END", argHash.extraData));
    } else logger[logType](logMessage);
  }

  static generateWrapStr(logTitle, separatorType, extraData) {
    return `${separatorType}${"-".repeat(
      5
    )}${logTitle.toUpperCase()}${"-".repeat(5)}${
      extraData ? `${extraData}${"-".repeat(5)}` : ""
    }${separatorType}`;
  }

  static buildMessage(logAttrs) {
    const msg = [`${logAttrs.logTitle}`];
    if (logAttrs.klass) msg.push("Class:", logAttrs.klass.name);
    if (logAttrs.message) msg.push("Message:", logAttrs.message);
    if (logAttrs.metadata) msg.push("Metadata:", logAttrs.metadata);
    if (logAttrs.exception)
      msg.push("ExceptionBacktrace:", logAttrs.exception.stack);
    if (logAttrs.fault) msg.push("Fault:", logAttrs.fault);

    return msg;
  }
}
