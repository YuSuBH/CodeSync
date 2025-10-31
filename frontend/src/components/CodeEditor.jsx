import { memo } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Editor from "@monaco-editor/react";

const CodeEditor = ({
  code,
  language,
  onChange,
  onExecute,
  output,
  isExecuting,
}) => {
  return (
    <PanelGroup direction="vertical" className="h-full">
      <Panel defaultSize={65} minSize={30}>
        <Editor
          height="100%"
          defaultLanguage={language}
          language={language}
          value={code}
          onChange={onChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            automaticLayout: true,
          }}
        />
      </Panel>
      <PanelResizeHandle className="h-1 bg-gray-300 hover:bg-blue-500 transition-colors cursor-row-resize" />
      <Panel defaultSize={35} minSize={20}>
        <div className="h-full p-4 flex flex-col bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-700">Output</h3>
            <button
              className={`px-4 py-2 rounded text-base transition-colors ${
                isExecuting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 cursor-pointer"
              } text-white font-medium`}
              onClick={onExecute}
              disabled={isExecuting}
            >
              {isExecuting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Executing...
                </span>
              ) : (
                "▶ Execute"
              )}
            </button>
          </div>
          <textarea
            className="flex-1 p-3 border border-gray-300 rounded text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            value={output}
            readOnly
            placeholder="Output will be shown here..."
          />
        </div>
      </Panel>
    </PanelGroup>
  );
};

export default memo(CodeEditor);
