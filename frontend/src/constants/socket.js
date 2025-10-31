export const SOCKET_URL = "http://localhost:5000";

export const SOCKET_EVENTS = {
  JOIN: "join",
  LEAVE_ROOM: "leaveRoom",
  CODE_CHANGE: "codeChange",
  LANGUAGE_CHANGE: "languageChange",
  COMPILE_CODE: "compileCode",
  TYPING: "typing",

  USER_JOINED: "userJoined",
  CODE_UPDATE: "codeUpdate",
  USER_TYPING: "userTyping",
  LANGUAGE_UPDATE: "languageUpdate",
  CODE_RESPONSE: "codeResponse",
  ERROR: "error",
};

export const TYPING_TIMEOUT = 2000;
export const COPY_SUCCESS_TIMEOUT = 2000;
