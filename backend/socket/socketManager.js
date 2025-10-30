import { Server } from "socket.io";
import { config } from "../config/config.js";
import { logger } from "../utils/logger.js";
import { registerRoomHandlers } from "./handlers/roomHandlers.js";
import { registerCodeHandlers } from "./handlers/codeHandlers.js";

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: config.cors,
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on("connection", (socket) => {
    logger.info(`User connected`, { socketId: socket.id });

    try {
      const cleanupRoom = registerRoomHandlers(io, socket);
      registerCodeHandlers(io, socket);

      socket.on("error", (error) => {
        logger.error(`Socket error`, {
          socketId: socket.id,
          error: error.message,
        });
      });

      socket.on("disconnect", () => {
        cleanupRoom();
        logger.info(`User disconnected`, { socketId: socket.id });
      });
    } catch (error) {
      logger.error(`Error setting up socket handlers`, {
        socketId: socket.id,
        error: error.message,
      });
      socket.disconnect(true);
    }
  });

  return io;
};
