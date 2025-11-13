import messageUtil from "./messages.js";
import { StatusCodes } from "http-status-codes";

export const successResponse = (res, message, data, token) => {
  const response = {
    success: true,
    message,
  };

  if (data) {
    response.data = data;
    if (token) response.token = token;
  }

  res.status(StatusCodes.OK).send(response);
};

export const serverErrorResponse = (res, error) => {
  const errorMsg = error?.toString()?.toLowerCase() || "";

  if (
    errorMsg.includes("incorrect") ||
    errorMsg.includes("wrong") ||
    errorMsg.includes("unauthorized") ||
    errorMsg.includes("invalid")
  ) {
    return res.status(StatusCodes.UNAUTHORIZED).send({
      success: false,
      message: error.toString(),
    });
  }

  // Resource not found
  if (errorMsg.includes("not found")) {
    return res.status(StatusCodes.NOT_FOUND).send({
      success: false,
      message: error.toString(),
    });
  }

  // Validation or bad request
  if (
    errorMsg.includes("required") ||
    errorMsg.includes("missing") ||
    errorMsg.includes("invalid input")
  ) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      success: false,
      message: error.toString(),
    });
  }

  // Default: true server/internal error
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
    success: false,
    error: error.toString(),
    message: messageUtil.serverError,
  });
};

export const validationErrorResponse = (res, errors) => {
  res.status(StatusCodes.NON_AUTHORITATIVE_INFORMATION).json({
    success: false,
    error: errors,
    message: messageUtil.validationErrors,
  });
};

export const badRequestErrorResponse = (res, message) => {
  res.status(StatusCodes.BAD_REQUEST).send({
    success: false,
    message,
  });
};

export const userExistResponse = (res, message) => {
  res.status(StatusCodes.OK).send({
    success: true,
    message,
  });
};

export const existAlreadyResponse = (res, message) => {
  res.status(StatusCodes.CONFLICT).send({
    success: false, // conflict should be false
    message,
  });
};

export const notFoundResponse = (res, message) => {
  res.status(StatusCodes.NOT_FOUND).send({
    success: false,
    message,
  });
};

export const authorizationErrorResponse = (res, message) => {
  res.status(StatusCodes.UNAUTHORIZED).send({
    success: false,
    message,
  });
};

export const manyRequestErrorResponse = (res, message) => {
  res.status(StatusCodes.TOO_MANY_REQUESTS).send({
    success: false,
    message,
  });
};
