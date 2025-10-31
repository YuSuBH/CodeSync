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

  logger.info("Socket.IO server initialized", { cors: config.cors });

  io.on("connection", (socket) => {
    logger.info(`User connected`, {
      socketId: socket.id,
      transport: socket.conn.transport.name,
      remoteAddress: socket.handshake.address,
    });

    try {
      const cleanupRoom = registerRoomHandlers(io, socket);
      registerCodeHandlers(io, socket);

      socket.on("error", (error) => {
        logger.error(`Socket error`, {
          socketId: socket.id,
          error: error.message,
        });
      });

      socket.on("disconnect", (reason) => {
        cleanupRoom();
        logger.info(`User disconnected`, { socketId: socket.id, reason });
      });
    } catch (error) {
      logger.error(`Error setting up socket handlers`, {
        socketId: socket.id,
        error: error.message,
        stack: error.stack,
      });
      socket.disconnect(true);
    }
  });

  io.engine.on("connection_error", (err) => {
    logger.error("Connection error", {
      code: err.code,
      message: err.message,
      context: err.context,
    });
  });

  return io;
};
