import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
  },
  piston: {
    apiUrl:
      process.env.PISTON_API_URL || "https://emkc.org/api/v2/piston/execute",
    timeout: parseInt(process.env.PISTON_TIMEOUT || "10000", 10),
  },
};
