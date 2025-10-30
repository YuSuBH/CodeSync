import express from "express";
import http from "http";
import path from "path";
import { config } from "./config/config.js";
import { logger } from "./utils/logger.js";
import { initializeSocket } from "./socket/socketManager.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { roomService } from "./services/roomService.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

const io = initializeSocket(server);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    rooms: roomService.getRoomCount(),
  });
});

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

app.use(errorHandler);

setInterval(() => {
  roomService.cleanupOldRooms();
}, 60 * 60 * 1000);

const gracefulShutdown = () => {
  logger.info("Shutting down gracefully...");

  io.close(() => {
    logger.info("Socket.io connections closed");
  });

  server.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });

  setTimeout(() => {
    logger.error("Forced shutdown");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

server.listen(config.port, () => {
  logger.info(`Server started on port ${config.port}`, {
    nodeEnv: config.nodeEnv,
    port: config.port,
  });
});
