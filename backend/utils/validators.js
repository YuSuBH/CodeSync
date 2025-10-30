export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

export const validators = {
  validateRoomId(roomId) {
    if (!roomId || typeof roomId !== "string" || roomId.trim().length === 0) {
      throw new ValidationError("Invalid room ID");
    }
    if (roomId.length > 100) {
      throw new ValidationError("Room ID too long");
    }
    return roomId.trim();
  },

  validateUserName(userName) {
    if (
      !userName ||
      typeof userName !== "string" ||
      userName.trim().length === 0
    ) {
      throw new ValidationError("Invalid user name");
    }
    if (userName.length > 50) {
      throw new ValidationError("User name too long");
    }
    return userName.trim();
  },

  validateCode(code) {
    if (typeof code !== "string") {
      throw new ValidationError("Invalid code format");
    }
    if (code.length > 100000) {
      throw new ValidationError("Code too long");
    }
    return code;
  },

  validateLanguage(language) {
    if (!language || typeof language !== "string") {
      throw new ValidationError("Invalid language");
    }
    return language;
  },

  validateVersion(version) {
    if (!version || typeof version !== "string") {
      throw new ValidationError("Invalid version");
    }
    return version;
  },
};
