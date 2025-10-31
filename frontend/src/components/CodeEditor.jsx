import { memo } from "react";
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
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-3">
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
      </div>
      <div className="flex-2 p-4 flex flex-col bg-gray-50 overflow-hidden">
        <button
          className={`px-4 py-2 rounded text-base transition-colors self-start mb-3 ${
            isExecuting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 cursor-pointer"
          } text-white`}
          onClick={onExecute}
          disabled={isExecuting}
        >
          {isExecuting ? "Executing..." : "Execute"}
        </button>
        <textarea
          className="flex-1 p-3 border border-gray-300 rounded text-base font-mono resize-none focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          value={output}
          readOnly
          placeholder="Output will be shown here..."
        />
      </div>
    </div>
  );
};

export default memo(CodeEditor);
