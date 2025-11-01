import { memo } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import MonacoEditor from "./MonacoEditor";
import OutputPanel from "./OutputPanel";

const CodeEditor = ({
  code,
  language,
  onChange,
  onExecute,
  output,
  isExecuting,
  roomId,
  userName,
  remoteCursors,
  remoteSelections,
  onCursorChange,
  onSelectionChange,
}) => {
  return (
    <PanelGroup direction="vertical" className="h-full">
      <Panel defaultSize={65} minSize={30}>
        <MonacoEditor
          code={code}
          language={language}
          onChange={onChange}
          roomId={roomId}
          userName={userName}
          remoteCursors={remoteCursors}
          remoteSelections={remoteSelections}
          onCursorChange={onCursorChange}
          onSelectionChange={onSelectionChange}
        />
      </Panel>
      <PanelResizeHandle className="h-1 bg-gray-300 hover:bg-blue-500 transition-colors cursor-row-resize" />
      <Panel defaultSize={35} minSize={20}>
        <OutputPanel
          output={output}
          isExecuting={isExecuting}
          onExecute={onExecute}
        />
      </Panel>
    </PanelGroup>
  );
};

export default memo(CodeEditor);
