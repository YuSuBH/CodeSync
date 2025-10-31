import { useState, useCallback } from "react";
import Sidebar from "./Sidebar";
import CodeEditor from "./CodeEditor";
import { COPY_SUCCESS_TIMEOUT } from "../constants/socket";

const CodeRoom = ({
  roomId,
  users,
  language,
  code,
  output,
  typingIndicator,
  isExecuting,
  onCodeChange,
  onLanguageChange,
  onExecute,
  onLeaveRoom,
}) => {
  const [copySuccess, setCopySuccess] = useState("");

  const handleCopyRoomId = useCallback(() => {
    navigator.clipboard
      .writeText(roomId)
      .then(() => {
        setCopySuccess("Copied!");
        setTimeout(() => setCopySuccess(""), COPY_SUCCESS_TIMEOUT);
      })
      .catch((err) => {
        console.error("Failed to copy room ID:", err);
        setCopySuccess("Failed to copy");
        setTimeout(() => setCopySuccess(""), COPY_SUCCESS_TIMEOUT);
      });
  }, [roomId]);

  const handleLanguageChange = useCallback(
    (e) => {
      onLanguageChange(e.target.value);
    },
    [onLanguageChange]
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        roomId={roomId}
        users={users}
        language={language}
        typingIndicator={typingIndicator}
        onCopyRoomId={handleCopyRoomId}
        onLanguageChange={handleLanguageChange}
        onLeaveRoom={onLeaveRoom}
        copySuccess={copySuccess}
      />
      <CodeEditor
        code={code}
        language={language}
        onChange={onCodeChange}
        onExecute={onExecute}
        output={output}
        isExecuting={isExecuting}
      />
    </div>
  );
};

export default CodeRoom;
