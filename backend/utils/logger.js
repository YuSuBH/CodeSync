const LOG_LEVELS = {
  ERROR: "ERROR",
  WARN: "WARN",
  INFO: "INFO",
  DEBUG: "DEBUG",
};

class Logger {
  log(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta,
    };

    const output = `[${timestamp}] [${level}] ${message}`;

    switch (level) {
      case LOG_LEVELS.ERROR:
        console.error(output, meta);
        break;
      case LOG_LEVELS.WARN:
        console.warn(output, meta);
        break;
      default:
        console.log(output, meta);
    }
  }

  error(message, meta) {
    this.log(LOG_LEVELS.ERROR, message, meta);
  }

  warn(message, meta) {
    this.log(LOG_LEVELS.WARN, message, meta);
  }

  info(message, meta) {
    this.log(LOG_LEVELS.INFO, message, meta);
  }

  debug(message, meta) {
    this.log(LOG_LEVELS.DEBUG, message, meta);
  }
}

export const logger = new Logger();
