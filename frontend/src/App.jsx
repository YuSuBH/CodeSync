import { useState, useCallback, useEffect, useRef } from "react";
import "./App.css";
import { Toaster, toast } from "react-hot-toast";
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
  const previousUsersRef = useRef([]);

  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (users.length === 0) return;

    const previousUsers = previousUsersRef.current;

    const newUsers = users.filter((user) => !previousUsers.includes(user));
    const leftUsers = previousUsers.filter((user) => !users.includes(user));

    newUsers.forEach((user) => {
      if (user !== userName) {
        toast.success(`${user} joined the room`, {
          icon: "👋",
          duration: 3000,
        });
      }
    });

    leftUsers.forEach((user) => {
      if (user !== userName) {
        toast.error(`${user} left the room`, {
          icon: "👋",
          duration: 3000,
        });
      }
    });

    previousUsersRef.current = users;
  }, [users, userName]);

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
      toast(`Language changed to ${newLanguage}`, {
        icon: "🔧",
        duration: 2000,
      });
    }, []),
    onTyping: useCallback((message) => setTyping(message), []),
    onCodeResponse: useCallback((response) => {
      console.log("Code response received:", response);
      const output =
        response?.run?.output || response?.run?.stderr || "No output";
      setOutput(output);
      setIsExecuting(false);

      if (response?.run?.stderr) {
        toast.error("Execution completed with errors", {
          duration: 2000,
        });
      } else {
        toast.success("Code executed successfully", {
          icon: "✅",
          duration: 2000,
        });
      }
    }, []),
    onError: useCallback((error) => {
      console.error("Socket error:", error);
      setOutput(`Error: ${error.message || "An error occurred"}`);
      setIsExecuting(false);
      toast.error(error.message || "An error occurred", {
        duration: 4000,
      });
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
        toast.error("Connection not ready. Please wait and try again.");
        return;
      }

      if (!socket.connected) {
        console.warn("Socket not connected yet, waiting...");
        toast.error(
          "Connecting to server. Please wait a moment and try again."
        );
        return;
      }

      const success = socketJoinRoom(newRoomId, newUserName);
      if (success) {
        toast.success(`Joined room: ${newRoomId}`, {
          icon: "🚀",
          duration: 3000,
        });
      }
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

    setTimeout(() => {
      setIsExecuting(false);
    }, 30000); // 30 seconds timeout
  }, [code, roomId, language, compileCode]);

  useBeforeUnload(socketLeaveRoom);

  if (!joined) {
    return (
      <>
        <Toaster position="top-right" />
        <JoinRoom onJoin={handleJoin} isConnected={isConnected} />
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <CodeRoom
        roomId={roomId}
        users={users}
        language={language}
        code={code}
        output={output}
        typingIndicator={typing}
        isExecuting={isExecuting}
        isConnected={isConnected}
        onCodeChange={handleCodeChange}
        onLanguageChange={handleLanguageChange}
        onExecute={handleExecute}
        onLeaveRoom={handleLeaveRoom}
      />
    </>
  );
};

export default App;
