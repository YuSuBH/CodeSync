import { memo } from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ code, language, onChange, onExecute, output }) => {
  return (
    <div className="editor-wrapper">
      <Editor
        height="60%"
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
      <button className="run-btn" onClick={onExecute}>
        Execute
      </button>
      <textarea
        className="output-response"
        value={output}
        readOnly
        placeholder="Output will be shown here..."
      />
    </div>
  );
};

export default memo(CodeEditor);
