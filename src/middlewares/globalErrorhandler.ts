import { ErrorRequestHandler } from "express";
// import config from "../config";

interface ErrorResponse {
  status: string;
  message: string;
  stack?: string;
  details?: any;
}

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err);
  //setting default values
  let message = err.message || "Internal Server Error";

  const statusCode = err.statusCode || 500;

  //ultimate return
  res.status(statusCode).json({
    success: false,
    message,
    error: err?.errors || err,
    // stack: config.NODE_ENV === "development" ? err?.stack : null,
  });
};

export default globalErrorHandler;
