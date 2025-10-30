import { logger } from "../utils/logger.js";

class RoomService {
  constructor() {
    this.rooms = new Map();
  }

  createRoom(roomId) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, {
        users: new Set(),
        code: "",
        language: "javascript",
        output: null,
        createdAt: Date.now(),
      });
      logger.info(`Room created: ${roomId}`);
    }
    return this.rooms.get(roomId);
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  hasRoom(roomId) {
    return this.rooms.has(roomId);
  }

  addUserToRoom(roomId, userName) {
    const room = this.createRoom(roomId);
    room.users.add(userName);
    logger.info(`User ${userName} added to room ${roomId}`);
    return Array.from(room.users);
  }

  removeUserFromRoom(roomId, userName) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.users.delete(userName);
      logger.info(`User ${userName} removed from room ${roomId}`);

      if (room.users.size === 0) {
        this.deleteRoom(roomId);
      }

      return Array.from(room.users);
    }
    return [];
  }

  getRoomUsers(roomId) {
    const room = this.rooms.get(roomId);
    return room ? Array.from(room.users) : [];
  }

  updateRoomOutput(roomId, output) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.output = output;
    }
  }

  deleteRoom(roomId) {
    this.rooms.delete(roomId);
    logger.info(`Room deleted: ${roomId}`);
  }

  getRoomCount() {
    return this.rooms.size;
  }

  cleanupOldRooms(maxAgeMs = 24 * 60 * 60 * 1000) {
    const now = Date.now();
    let cleaned = 0;

    for (const [roomId, room] of this.rooms.entries()) {
      if (now - room.createdAt > maxAgeMs && room.users.size === 0) {
        this.deleteRoom(roomId);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logger.info(`Cleaned up ${cleaned} old rooms`);
    }

    return cleaned;
  }
}

export const roomService = new RoomService();
