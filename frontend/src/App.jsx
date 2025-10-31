import { useState, useCallback } from "react";
import "./App.css";
import { useSocket } from "./hooks/useSocket";
import { useRoom } from "./hooks/useRoom";
import { useBeforeUnload } from "./hooks/useBeforeUnload";
import JoinRoom from "./components/JoinRoom";
import CodeRoom from "./components/CodeRoom";
import { DEFAULT_CODE, DEFAULT_LANGUAGE } from "./constants/languages";

const App = () => {
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState("");
  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);

  const socket = useSocket();

  const roomHandlers = {
    onUsersUpdate: useCallback((users) => {
      console.log("Users updated:", users);
      setUsers(users);
    }, []),
    onCodeUpdate: useCallback((newCode) => {
      console.log("Code updated:", newCode.substring(0, 50));
      setCode(newCode);
    }, []),
    onLanguageUpdate: useCallback((newLanguage) => {
      console.log("Language updated:", newLanguage);
      setLanguage(newLanguage);
    }, []),
    onTyping: useCallback((message) => setTyping(message), []),
    onCodeResponse: useCallback((response) => {
      console.log("Code response received:", response);
      const output =
        response?.run?.output || response?.run?.stderr || "No output";
      setOutput(output);
      setIsExecuting(false);
    }, []),
    onError: useCallback((error) => {
      console.error("Socket error:", error);
      setOutput(`Error: ${error.message || "An error occurred"}`);
      setIsExecuting(false);
    }, []),
  };

  const {
    joinRoom: socketJoinRoom,
    leaveRoom: socketLeaveRoom,
    emitCodeChange,
    emitTyping,
    emitLanguageChange,
    compileCode,
  } = useRoom(socket, roomHandlers);

  const handleJoin = useCallback(
    (newRoomId, newUserName) => {
      console.log("Attempting to join room:", newRoomId, "as", newUserName);
      console.log("Socket status:", socket ? "Socket exists" : "No socket");
      console.log("Socket connected:", socket?.connected);

      if (!socket) {
        console.error("Socket not initialized");
        alert("Connection not ready. Please wait and try again.");
        return;
      }

      if (!socket.connected) {
        console.warn("Socket not connected yet, waiting...");
        alert("Connecting to server. Please wait a moment and try again.");
        return;
      }

      const success = socketJoinRoom(newRoomId, newUserName);
      console.log("Join success:", success);
      if (success) {
        setRoomId(newRoomId);
        setUserName(newUserName);
        setJoined(true);
      }
    },
    [socketJoinRoom, socket]
  );

  const handleLeaveRoom = useCallback(() => {
    socketLeaveRoom();
    setJoined(false);
    setRoomId("");
    setUserName("");
    setCode(DEFAULT_CODE);
    setLanguage(DEFAULT_LANGUAGE);
    setUsers([]);
    setTyping("");
    setOutput("");
  }, [socketLeaveRoom]);

  const handleCodeChange = useCallback(
    (newCode) => {
      setCode(newCode);
      console.log("Emitting code change to room:", roomId);
      emitCodeChange(roomId, newCode);
      emitTyping(roomId, userName);
    },
    [roomId, userName, emitCodeChange, emitTyping]
  );

  const handleLanguageChange = useCallback(
    (newLanguage) => {
      setLanguage(newLanguage);
      emitLanguageChange(roomId, newLanguage);
    },
    [roomId, emitLanguageChange]
  );

  const handleExecute = useCallback(() => {
    console.log("Execute button clicked", {
      roomId,
      language,
      codeLength: code.length,
    });
    setIsExecuting(true);
    setOutput("Executing...");
    compileCode(code, roomId, language);

    // Timeout fallback in case response never comes
    setTimeout(() => {
      setIsExecuting(false);
    }, 30000); // 30 seconds timeout
  }, [code, roomId, language, compileCode]);

  useBeforeUnload(socketLeaveRoom);

  if (!joined) {
    return <JoinRoom onJoin={handleJoin} />;
  }

  return (
    <CodeRoom
      roomId={roomId}
      users={users}
      language={language}
      code={code}
      output={output}
      typingIndicator={typing}
      isExecuting={isExecuting}
      onCodeChange={handleCodeChange}
      onLanguageChange={handleLanguageChange}
      onExecute={handleExecute}
      onLeaveRoom={handleLeaveRoom}
    />
  );
};

export default App;
