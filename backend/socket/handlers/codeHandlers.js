import { roomService } from "../../services/roomService.js";
import { pistonService } from "../../services/pistonService.js";
import { validators, ValidationError } from "../../utils/validators.js";
import { logger } from "../../utils/logger.js";

export const registerCodeHandlers = (io, socket) => {
  const codeChange = ({ roomId, code }) => {
    try {
      const validRoomId = validators.validateRoomId(roomId);
      const validCode = validators.validateCode(code);

      const room = roomService.getRoom(validRoomId);
      if (room) {
        room.code = validCode;
      }

      socket.to(validRoomId).emit("codeUpdate", validCode);

      logger.debug(`Code changed in room`, {
        roomId: validRoomId,
        codeLength: validCode.length,
      });
    } catch (error) {
      logger.error(`Error handling code change`, {
        socketId: socket.id,
        error: error.message,
      });
      socket.emit("error", {
        message:
          error instanceof ValidationError
            ? error.message
            : "Failed to update code",
      });
    }
  };

  const languageChange = ({ roomId, language }) => {
    try {
      const validRoomId = validators.validateRoomId(roomId);
      const validLanguage = validators.validateLanguage(language);

      const room = roomService.getRoom(validRoomId);
      if (room) {
        room.language = validLanguage;
      }

      io.to(validRoomId).emit("languageUpdate", validLanguage);

      logger.info(`Language changed in room`, {
        roomId: validRoomId,
        language: validLanguage,
      });
    } catch (error) {
      logger.error(`Error handling language change`, {
        socketId: socket.id,
        error: error.message,
      });
      socket.emit("error", {
        message:
          error instanceof ValidationError
            ? error.message
            : "Failed to change language",
      });
    }
  };

  const compileCode = async ({ code, roomId, language, version }) => {
    try {
      const validRoomId = validators.validateRoomId(roomId);
      const validCode = validators.validateCode(code);
      const validLanguage = validators.validateLanguage(language);
      const validVersion = validators.validateVersion(version);

      if (!roomService.hasRoom(validRoomId)) {
        throw new ValidationError("Room not found");
      }

      logger.info(`Compiling code`, {
        roomId: validRoomId,
        language: validLanguage,
        version: validVersion,
      });

      const response = await pistonService.executeCode({
        code: validCode,
        language: validLanguage,
        version: validVersion,
      });

      roomService.updateRoomOutput(validRoomId, response.run?.output);
      io.to(validRoomId).emit("codeResponse", response);

      logger.info(`Code compiled successfully`, {
        roomId: validRoomId,
        language: validLanguage,
      });
    } catch (error) {
      logger.error(`Error compiling code`, {
        socketId: socket.id,
        roomId,
        error: error.message,
      });

      const errorResponse = {
        run: {
          output: `Error: ${error.message}`,
          code: 1,
          stderr: error.message,
        },
      };

      io.to(roomId).emit("codeResponse", errorResponse);
    }
  };

  const typing = ({ roomId, userName }) => {
    try {
      const validRoomId = validators.validateRoomId(roomId);
      const validUserName = validators.validateUserName(userName);

      socket.to(validRoomId).emit("userTyping", validUserName);
    } catch (error) {
      logger.error(`Error handling typing event`, {
        socketId: socket.id,
        error: error.message,
      });
    }
  };

  const cursorChange = ({ roomId, userName, position }) => {
    try {
      const validRoomId = validators.validateRoomId(roomId);
      const validUserName = validators.validateUserName(userName);

      logger.info(
        `[Backend] Received cursorChange from socket ${
          socket.id
        }: userName="${validUserName}", position=${JSON.stringify(
          position
        )}, broadcasting to room "${validRoomId}"`
      );

      socket.to(validRoomId).emit("cursorUpdate", {
        userName: validUserName,
        position,
      });
    } catch (error) {
      logger.error(`Error handling cursor change`, {
        socketId: socket.id,
        error: error.message,
      });
    }
  };

  const selectionChange = ({ roomId, userName, selection }) => {
    try {
      const validRoomId = validators.validateRoomId(roomId);
      const validUserName = validators.validateUserName(userName);

      socket.to(validRoomId).emit("selectionUpdate", {
        userName: validUserName,
        selection,
      });
    } catch (error) {
      logger.error(`Error handling selection change`, {
        socketId: socket.id,
        error: error.message,
      });
    }
  };

  socket.on("codeChange", codeChange);
  socket.on("languageChange", languageChange);
  socket.on("compileCode", compileCode);
  socket.on("typing", typing);
  socket.on("cursorChange", cursorChange);
  socket.on("selectionChange", selectionChange);
};
