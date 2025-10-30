import { logger } from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  logger.error(`Express error`, {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal server error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};

export const notFoundHandler = (req, res) => {
  logger.warn(`Route not found`, {
    path: req.path,
    method: req.method,
  });

  res.status(404).json({
    error: {
      message: "Route not found",
    },
  });
};
