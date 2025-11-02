import { useState, useCallback } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Sidebar from "./Sidebar";
import CodeEditor from "./CodeEditor";
import ConnectionStatus from "./ConnectionStatus";
import { COPY_SUCCESS_TIMEOUT } from "../constants/socket";

const CodeRoom = ({
  roomId,
  userName,
  users,
  language,
  code,
  output,
  typingIndicator,
  isExecuting,
  isConnected,
  remoteCursors,
  remoteSelections,
  onCodeChange,
  onLanguageChange,
  onExecute,
  onLeaveRoom,
  onCursorChange,
  onSelectionChange,
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
    <div className="h-screen overflow-hidden flex flex-col">
      <div className="bg-slate-800 px-4 py-2 flex items-center justify-between">
        <h1 className="text-white text-lg font-semibold">CodeSync</h1>
        <ConnectionStatus isConnected={isConnected} />
      </div>
      <PanelGroup direction="horizontal" className="flex-1">
        <Panel defaultSize={20} minSize={15} maxSize={30}>
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
        </Panel>
        <PanelResizeHandle className="w-1 bg-gray-300 hover:bg-blue-500 transition-colors cursor-col-resize" />
        <Panel defaultSize={80}>
          <CodeEditor
            code={code}
            language={language}
            onChange={onCodeChange}
            onExecute={onExecute}
            output={output}
            isExecuting={isExecuting}
            roomId={roomId}
            userName={userName}
            remoteCursors={remoteCursors}
            remoteSelections={remoteSelections}
            onCursorChange={onCursorChange}
            onSelectionChange={onSelectionChange}
          />
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default CodeRoom;
