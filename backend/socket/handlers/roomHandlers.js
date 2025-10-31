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

      // Get the room to access existing state
      const room = roomService.getRoom(validRoomId);

      // Add user and get updated user list
      const users = roomService.addUserToRoom(validRoomId, validUserName);

      // Send updated user list to all users in the room
      io.to(validRoomId).emit("userJoined", users);

      // If room has existing state, send it to the newly joined user
      if (room && room.code) {
        socket.emit("codeUpdate", room.code);
      }
      if (room && room.language && room.language !== "javascript") {
        socket.emit("languageUpdate", room.language);
      }

      logger.info(`User joined room`, {
        socketId: socket.id,
        userName: validUserName,
        roomId: validRoomId,
        usersCount: users.length,
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
