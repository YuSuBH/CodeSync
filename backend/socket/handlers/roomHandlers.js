import { roomService } from "../../services/roomService.js";
import { validators, ValidationError } from "../../utils/validators.js";
import { logger } from "../../utils/logger.js";

export const registerRoomHandlers = (io, socket) => {
  let currentRoom = null;
  let currentUser = null;

  const join = ({ roomId, userName }) => {
    try {
      const validRoomId = validators.validateRoomId(roomId);
      const validUserName = validators.validateUserName(userName);

      if (currentRoom) {
        socket.leave(currentRoom);
        const users = roomService.removeUserFromRoom(currentRoom, currentUser);
        io.to(currentRoom).emit("userJoined", users);
      }

      currentRoom = validRoomId;
      currentUser = validUserName;

      socket.join(validRoomId);
      const users = roomService.addUserToRoom(validRoomId, validUserName);

      io.to(validRoomId).emit("userJoined", users);

      logger.info(`User joined room`, {
        socketId: socket.id,
        userName: validUserName,
        roomId: validRoomId,
      });
    } catch (error) {
      logger.error(`Error joining room`, {
        socketId: socket.id,
        error: error.message,
      });
      socket.emit("error", {
        message:
          error instanceof ValidationError
            ? error.message
            : "Failed to join room",
      });
    }
  };

  const leaveRoom = () => {
    try {
      if (currentUser && currentRoom) {
        const users = roomService.removeUserFromRoom(currentRoom, currentUser);
        io.to(currentRoom).emit("userJoined", users);

        socket.leave(currentRoom);

        logger.info(`User left room`, {
          socketId: socket.id,
          userName: currentUser,
          roomId: currentRoom,
        });

        currentRoom = null;
        currentUser = null;
      }
    } catch (error) {
      logger.error(`Error leaving room`, {
        socketId: socket.id,
        error: error.message,
      });
    }
  };

  const handleDisconnect = () => {
    try {
      if (currentUser && currentRoom) {
        const users = roomService.removeUserFromRoom(currentRoom, currentUser);
        io.to(currentRoom).emit("userJoined", users);

        logger.info(`User disconnected`, {
          socketId: socket.id,
          userName: currentUser,
          roomId: currentRoom,
        });
      }
    } catch (error) {
      logger.error(`Error handling disconnect`, {
        socketId: socket.id,
        error: error.message,
      });
    }
  };

  socket.on("join", join);
  socket.on("leaveRoom", leaveRoom);
  socket.on("disconnect", handleDisconnect);

  return () => {
    handleDisconnect();
  };
};
