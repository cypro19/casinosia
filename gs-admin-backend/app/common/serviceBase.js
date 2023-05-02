import validate from "validate.js";
import _ from "lodash";
import logger from "./logger";

export default class ServiceBase {
  constructor() {
    this._args = arguments[0];
    this._context = arguments[1];
    this._errors = {};
    this._successful = null;
    this._failed = null;
    this._result = null;
    this.validateServiceInputs();
    this._filteredArgs = this.filterArgs();
    _.extend(this, this._filteredArgs);
  }

  get context() {
    return this._context;
  }

  get args() {
    return this._args;
  }

  get filteredArgs() {
    return this._filteredArgs;
  }

  get result() {
    return this._result;
  }

  get failed() {
    return this._failed;
  }

  get errors() {
    return this._errors;
  }

  get successful() {
    return this._successful;
  }

  get log() {
    return {
      info: (logTitle, argHash = {}) => {
        argHash.klass = this.constructor;
        logger.info(logTitle, argHash);
      },
      debug: (logTitle, argHash = {}) => {
        argHash.klass = this.constructor;
        logger.debug(logTitle, argHash);
      },
      error: (logTitle, argHash = {}) => {
        argHash.klass = this.constructor;
        logger.error(logTitle, argHash);
      },
    };
  }

  async tryExecuting() {
    if (_.size(this.errors)) {
      this._failed = true;
      this._successful = false;
      return;
    }
    try {
      this._result = await this.run();
    } catch (error) {
      logger.error("Exception raised in Service", {
        klass: this.constructor,
        message: error.message,
        context: this.args,
        exception: error,
        userCtx: this.context,
      });
      throw error;
    }
    this._successful = !_.size(this.errors);
    this._failed = !!_.size(this.errors);
  }

  addError(attribute, errorMessage) {
    logger.debug("Custom Validation Failed", {
      klass: this.constructor,
      message: `${
        typeof errorMessage === "object" ? errorMessage?.message : errorMessage
      }`,
      context: { attribute },
      userCtx: this.context,
      fault: this.errors,
    });

    // overwriting the previous error if error is already set
    if (!_.isEmpty(this._errors)) {
      this._errors = {
        [attribute]: errorMessage,
      };
    } else {
      this._errors[attribute] = errorMessage;
    }
  }

  mergeErrors(errors) {
    _.defaults(this._errors, errors);
  }

  setResponseStatusCode(responseStatusCode) {
    this._errors.status = this._errors.status || responseStatusCode;
  }

  filterArgs() {
    return validate.cleanAttributes(this._args, this.constraints);
  }

  async validateServiceInputs() {
    const validationErrors = validate(this._args, this.constraints);
    const errors = {};
    _.forEach(validationErrors, (error, key) => {
      errors[key] = error[0];
    });
    if (_.size(errors)) {
      _.extend(this.errors, { [this.constructor.name]: errors });
      logger.debug("Service input Validation Failed", {
        klass: this.constructor,
        message: "Validation Failed",
        context: this.args,
        userCtx: this.context,
        fault: this.errors,
      });
    }
  }

  // Static methods

  static async run() {
    logger.info(`Service Started: ${this.name}`, {
      context: this.args,
      userCtx: this.context,
      wrap: "start",
    });

    const args = arguments;
    const instance = new this(...args);

    await instance.tryExecuting();

    if (_.size(instance.errors)) throw instance.errors;
    logger.info(`Service Finished: ${this.name}`, {
      context: this.args,
      userCtx: this.context,
      wrap: "end",
    });

    return instance.result;
  }

  static async execute() {
    logger.info(`Service Started: ${this.name}`, {
      context: this.args,
      userCtx: this.context,
      wrap: "start",
    });

    const args = arguments;
    const instance = new this(...args);

    await instance.tryExecuting();
    logger.info(`Service Finished: ${this.name}`, {
      context: this.args,
      userCtx: this.context,
      wrap: "end",
    });

    return instance;
  }
}
