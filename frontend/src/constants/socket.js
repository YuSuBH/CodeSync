export const SOCKET_URL = "http://localhost:5000";

export const SOCKET_EVENTS = {
  JOIN: "join",
  LEAVE_ROOM: "leaveRoom",
  CODE_CHANGE: "codeChange",
  LANGUAGE_CHANGE: "languageChange",
  COMPILE_CODE: "compileCode",
  TYPING: "typing",
  CURSOR_CHANGE: "cursorChange",
  SELECTION_CHANGE: "selectionChange",

  USER_JOINED: "userJoined",
  CODE_UPDATE: "codeUpdate",
  USER_TYPING: "userTyping",
  LANGUAGE_UPDATE: "languageUpdate",
  CODE_RESPONSE: "codeResponse",
  CURSOR_UPDATE: "cursorUpdate",
  SELECTION_UPDATE: "selectionUpdate",
  ERROR: "error",
};

export const TYPING_TIMEOUT = 2000;
export const COPY_SUCCESS_TIMEOUT = 2000;
export const CURSOR_UPDATE_THROTTLE = 100; // ms
