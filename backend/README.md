# Backend - Refactored Structure

## Project Structure

```
backend/
├── config/
│   └── config.js              # Centralized configuration
├── middleware/
│   └── errorHandler.js        # Express error handling
├── services/
│   ├── pistonService.js       # Code execution API service
│   └── roomService.js         # Room management business logic
├── socket/
│   ├── handlers/
│   │   ├── codeHandlers.js    # Code-related socket events
│   │   └── roomHandlers.js    # Room & user socket events
│   └── socketManager.js       # Socket.io initialization
├── utils/
│   ├── logger.js              # Logging utility
│   └── validators.js          # Input validation
├── .env.example               # Environment variables template
└── index.js                   # Application entry point
```

## Key Improvements

### ✅ Separation of Concerns

- **Services**: Business logic separated from socket handlers
- **Handlers**: Socket event handlers organized by domain
- **Middleware**: Reusable Express middleware
- **Utils**: Shared utilities (logging, validation)

### ✅ Error Handling

- Try-catch blocks in all async operations
- Proper error logging with context
- User-friendly error messages
- Graceful error recovery

### ✅ Input Validation

- Validates all user inputs (roomId, userName, code, etc.)
- Prevents injection attacks
- Length limits to prevent abuse
- Custom ValidationError class

### ✅ Logging

- Structured logging with levels (ERROR, WARN, INFO, DEBUG)
- Timestamps and metadata for debugging
- Easy to extend for external logging services

### ✅ Configuration Management

- Environment variables for configuration
- Default values for development
- Easy to adjust for different environments

### ✅ Resource Management

- Automatic cleanup of empty rooms
- Periodic cleanup of old rooms
- Graceful shutdown handling
- Proper connection cleanup

### ✅ Code Quality

- Clear naming conventions
- Single Responsibility Principle
- DRY (Don't Repeat Yourself)
- Easy to test individual components
- TypeScript-ready structure

## Setup

1. Copy the environment variables:

   ```bash
   cp .env.example .env
   ```

2. Install dependencies (if not already installed):

   ```bash
   npm install dotenv
   ```

3. Start the server:
   ```bash
   npm start
   ```

## Environment Variables

| Variable       | Description                          | Default                                |
| -------------- | ------------------------------------ | -------------------------------------- |
| PORT           | Server port                          | 5000                                   |
| NODE_ENV       | Environment (development/production) | development                            |
| CORS_ORIGIN    | CORS allowed origins                 | \*                                     |
| PISTON_API_URL | Code execution API URL               | https://emkc.org/api/v2/piston/execute |
| PISTON_TIMEOUT | API timeout in ms                    | 10000                                  |

## API Endpoints

### Health Check

```
GET /api/health
```

Returns server status, uptime, and active room count.

## Socket Events

### Client → Server

- `join` - Join a room
- `leaveRoom` - Leave current room
- `codeChange` - Notify code changes
- `languageChange` - Change programming language
- `compileCode` - Execute code
- `typing` - Notify typing indicator

### Server → Client

- `userJoined` - User list updated
- `codeUpdate` - Code synchronized
- `languageUpdate` - Language changed
- `codeResponse` - Compilation result
- `userTyping` - User is typing
- `error` - Error occurred

## Features

- ✅ Real-time code collaboration
- ✅ Multi-room support
- ✅ User presence tracking
- ✅ Code execution via Piston API
- ✅ Automatic room cleanup
- ✅ Graceful shutdown
- ✅ Error recovery
- ✅ Production-ready logging

## Testing

The modular structure makes it easy to test:

```javascript
// Example: Test roomService
import { roomService } from "./services/roomService.js";

// Create room
const room = roomService.createRoom("test-room");
// Add user
roomService.addUserToRoom("test-room", "testUser");
// Get users
const users = roomService.getRoomUsers("test-room");
```

## Future Improvements

- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Implement rate limiting
- [ ] Add Redis for room persistence
- [ ] Add authentication/authorization
- [ ] Add metrics and monitoring
- [ ] Add TypeScript support
- [ ] Add WebSocket compression
