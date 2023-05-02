import { StatusCodes } from "http-status-codes";

export const RequestInputValidationErrorType = {
  name: "RequestInputValidationError",
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: "Please check the request data",
  errorCode: 3001,
};

export const ResponseValidationErrorType = {
  name: "ResponseInputValidationError",
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: false,
  description:
    "Response validation failed please refer json schema of response",
  errorCode: 3002,
};

export const SocketRequestInputValidationErrorType = {
  name: "SocketRequestInputValidationError",
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: "Please check the request data",
  errorCode: 3003,
};

export const SocketResponseValidationErrorType = {
  name: "SocketResponseValidationError",
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: false,
  description:
    "Response validation of socket failed please refer json schema of response",
  errorCode: 3004,
};

export const InternalServerErrorType = {
  name: "InternalServerError",
  statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  isOperational: true,
  description: "Internal Server Error",
  errorCode: 3005,
};

export const InvalidSocketArgumentErrorType = {
  name: "InvalidSocketArgumentError",
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description:
    "Please provide, proper arguments eventName, [payloadObject], and [callback]",
  errorCode: 3006,
};
