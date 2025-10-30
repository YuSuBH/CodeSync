import axios from "axios";
import { config } from "../config/config.js";
import { logger } from "../utils/logger.js";

class PistonService {
  constructor() {
    this.apiUrl = config.piston.apiUrl;
    this.timeout = config.piston.timeout;
  }

  async executeCode({ code, language, version }) {
    try {
      logger.info(`Executing code`, { language, version });

      const response = await axios.post(
        this.apiUrl,
        {
          language,
          version,
          files: [{ content: code }],
        },
        {
          timeout: this.timeout,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      logger.info(`Code execution completed`, {
        language,
        success: response.data?.run?.code === 0,
      });

      return response.data;
    } catch (error) {
      logger.error(`Code execution failed`, {
        language,
        error: error.message,
        status: error.response?.status,
      });

      if (error.response) {
        throw new Error(
          `Piston API error: ${error.response.data?.message || error.message}`
        );
      } else if (error.request) {
        throw new Error("Piston API is not responding");
      } else {
        throw new Error(`Failed to execute code: ${error.message}`);
      }
    }
  }
}

export const pistonService = new PistonService();
