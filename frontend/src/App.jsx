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
      setOutput(response?.run?.output || "No output");
    }, []),
    onError: useCallback((error) => {
      console.error("Socket error:", error);
      setOutput(`Error: ${error.message || "An error occurred"}`);
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
      console.log("Socket status:", socket ? "connected" : "not connected");
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
    compileCode(code, roomId, language);
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
      onCodeChange={handleCodeChange}
      onLanguageChange={handleLanguageChange}
      onExecute={handleExecute}
      onLeaveRoom={handleLeaveRoom}
    />
  );
};

export default App;
