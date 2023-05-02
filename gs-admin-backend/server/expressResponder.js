import _ from "lodash";
import logger from "../app/common/logger";
import { ERRORS, ERROR_MSG } from "../app/utils/errors";

function Responder() {}

/*
 * This method sends the response to the client.
 */
function sendResponse(res, status, body) {
  if (!res.headersSent) {
    if (body) {
      return res.status(status).json(body);
    }
    return res.status(status).send();
  }
  logger.error("Response already sent.");
}

/*
 * These methods are called to respond to the API user with the information on
 * what is the result of the incomming request
 */
Responder.sendJSONResponse = (res, obj) => sendResponse(res, 200, obj);

Responder.success = (res, data) => {
  // we can have different types of data
  // Case 1: [{app: 'gammastack_gaming'}] (array)
  // Case 2: {app: 'gammastack_gaming'} (object) or {app: 'gammastack_gaming', message: 'custom message'}
  // Case 3: Any message like 'Record has been successfully deleted'
  // Case 4: Data types other than above mentioned cases i.e boolean, null

  // In every case, we're sending the response in the below format
  // {
  //   data: [] or any data
  //   message: Custom message or default message as mentioned below
  // }

  let message = "Request has been processed successfully.";
  if (_.isString(data)) {
    message = data;
    data = "";
  } else if (_.isObject(data) && data.message) {
    message = data.message;
  }

  if (data && data.message) {
    delete data.message;
  }

  return sendResponse(res, 200, { data: data || [], message });
};

Responder.failed = (res, errorObj) => {
  // get the error key
  const keys = errorObj && Object.keys(errorObj);
  const errorName = keys && keys.length && keys[0];

  if (errorObj && _.isObject(errorObj)) {
    let errorMsg = errorObj[errorName];

    if (errorMsg && _.isObject(errorMsg)) {
      errorMsg = errorMsg[Object.keys(errorMsg)[0]];
      res.boom.badData(errorMsg);
    } else {
      const errorValue = Object.keys(errorObj)[0];

      if (Object.keys(errorObj)[0] === "badData") res.boom.badData(errorMsg);
      else res.boom[errorValue](errorMsg);
    }
  } else if (errorName && _.isFunction(res.boom[errorName])) {
    let errorMessage;
    if (errorName === ERRORS.INTERNAL) {
      errorMessage = ERROR_MSG.SERVER_ERROR;
    } else {
      errorMessage = errorObj[errorName];
    }
    res.boom[errorName](errorMessage);
  } else {
    res.boom.internal(ERROR_MSG.SERVER_ERROR);
  }
};

export default Responder;
