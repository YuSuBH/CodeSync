import { useEffect, useCallback, useRef } from "react";
import { SOCKET_EVENTS, TYPING_TIMEOUT } from "../constants/socket";

export const useRoom = (socket, handlers) => {
  const typingTimeoutRef = useRef(null);

  const {
    onUsersUpdate,
    onCodeUpdate,
    onLanguageUpdate,
    onTyping,
    onCodeResponse,
    onError,
    onCursorUpdate,
    onSelectionUpdate,
  } = handlers;

  useEffect(() => {
    if (!socket) {
      console.log("useRoom: No socket available");
      return;
    }

    console.log("useRoom: Setting up socket listeners");

    const handleUserJoined = (users) => {
      console.log("useRoom: Received userJoined event", {
        users,
        count: users?.length,
      });
      onUsersUpdate?.(users);
    };

    const handleCodeUpdate = (newCode) => {
      console.log("useRoom: Received codeUpdate event", {
        codeLength: newCode?.length,
      });
      onCodeUpdate?.(newCode);
    };

    const handleUserTyping = (user) => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      onTyping?.(`${user.slice(0, 8)}... is typing`);

      typingTimeoutRef.current = setTimeout(() => {
        onTyping?.("");
      }, TYPING_TIMEOUT);
    };

    const handleLanguageUpdate = (newLanguage) => {
      onLanguageUpdate?.(newLanguage);
    };

    const handleCodeResponse = (response) => {
      onCodeResponse?.(response);
    };

    const handleError = (error) => {
      onError?.(error);
    };

    const handleCursorUpdate = ({ userName, position }) => {
      onCursorUpdate?.(userName, position);
    };

    const handleSelectionUpdate = ({ userName, selection }) => {
      onSelectionUpdate?.(userName, selection);
    };

    socket.on(SOCKET_EVENTS.USER_JOINED, handleUserJoined);
    socket.on(SOCKET_EVENTS.CODE_UPDATE, handleCodeUpdate);
    socket.on(SOCKET_EVENTS.USER_TYPING, handleUserTyping);
    socket.on(SOCKET_EVENTS.LANGUAGE_UPDATE, handleLanguageUpdate);
    socket.on(SOCKET_EVENTS.CODE_RESPONSE, handleCodeResponse);
    socket.on(SOCKET_EVENTS.CURSOR_UPDATE, handleCursorUpdate);
    socket.on(SOCKET_EVENTS.SELECTION_UPDATE, handleSelectionUpdate);
    socket.on(SOCKET_EVENTS.ERROR, handleError);

    return () => {
      socket.off(SOCKET_EVENTS.USER_JOINED, handleUserJoined);
      socket.off(SOCKET_EVENTS.CODE_UPDATE, handleCodeUpdate);
      socket.off(SOCKET_EVENTS.USER_TYPING, handleUserTyping);
      socket.off(SOCKET_EVENTS.LANGUAGE_UPDATE, handleLanguageUpdate);
      socket.off(SOCKET_EVENTS.CODE_RESPONSE, handleCodeResponse);
      socket.off(SOCKET_EVENTS.CURSOR_UPDATE, handleCursorUpdate);
      socket.off(SOCKET_EVENTS.SELECTION_UPDATE, handleSelectionUpdate);
      socket.off(SOCKET_EVENTS.ERROR, handleError);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [
    socket,
    onUsersUpdate,
    onCodeUpdate,
    onLanguageUpdate,
    onTyping,
    onCodeResponse,
    onCursorUpdate,
    onSelectionUpdate,
    onError,
  ]);

  const joinRoom = useCallback(
    (roomId, userName) => {
      console.log("joinRoom called:", {
        roomId,
        userName,
        hasSocket: !!socket,
      });
      if (socket && roomId && userName) {
        console.log("Emitting join event");
        socket.emit(SOCKET_EVENTS.JOIN, { roomId, userName });
        return true;
      }
      console.warn("Cannot join room - missing socket or credentials");
      return false;
    },
    [socket]
  );

  const leaveRoom = useCallback(() => {
    if (socket) {
      socket.emit(SOCKET_EVENTS.LEAVE_ROOM);
    }
  }, [socket]);

  const emitCodeChange = useCallback(
    (roomId, code) => {
      if (socket) {
        console.log("Emitting codeChange event");
        socket.emit(SOCKET_EVENTS.CODE_CHANGE, { roomId, code });
      }
    },
    [socket]
  );

  const emitTyping = useCallback(
    (roomId, userName) => {
      if (socket) {
        socket.emit(SOCKET_EVENTS.TYPING, { roomId, userName });
      }
    },
    [socket]
  );

  const emitLanguageChange = useCallback(
    (roomId, language) => {
      if (socket) {
        socket.emit(SOCKET_EVENTS.LANGUAGE_CHANGE, { roomId, language });
      }
    },
    [socket]
  );

  const compileCode = useCallback(
    (code, roomId, language, version = "*") => {
      if (socket) {
        socket.emit(SOCKET_EVENTS.COMPILE_CODE, {
          code,
          roomId,
          language,
          version,
        });
      }
    },
    [socket]
  );

  const emitCursorChange = useCallback(
    (roomId, userName, position) => {
      if (socket) {
        socket.emit(SOCKET_EVENTS.CURSOR_CHANGE, {
          roomId,
          userName,
          position,
        });
      }
    },
    [socket]
  );

  const emitSelectionChange = useCallback(
    (roomId, userName, selection) => {
      if (socket) {
        socket.emit(SOCKET_EVENTS.SELECTION_CHANGE, {
          roomId,
          userName,
          selection,
        });
      }
    },
    [socket]
  );

  return {
    joinRoom,
    leaveRoom,
    emitCodeChange,
    emitTyping,
    emitLanguageChange,
    compileCode,
    emitCursorChange,
    emitSelectionChange,
  };
};
