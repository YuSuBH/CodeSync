import { memo, useRef, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { useEditorEvents } from "../hooks/useEditorEvents";
import { useEditorDecorations } from "../hooks/useEditorDecorations";

const MonacoEditor = ({
  code,
  language,
  onChange,
  roomId,
  userName,
  remoteCursors,
  remoteSelections,
  onCursorChange,
  onSelectionChange,
}) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  const { setupEditorListeners } = useEditorEvents(
    roomId,
    userName,
    onCursorChange,
    onSelectionChange
  );

  useEditorDecorations(
    editorRef,
    monacoRef,
    userName,
    remoteCursors,
    remoteSelections
  );

  const handleEditorDidMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;
      monacoRef.current = monaco;
      setupEditorListeners(editor);
    },
    [setupEditorListeners]
  );

  const handleChange = useCallback(
    (newCode) => {
      onChange(newCode);
    },
    [onChange]
  );

  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      language={language}
      value={code}
      onChange={handleChange}
      onMount={handleEditorDidMount}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        automaticLayout: true,
      }}
    />
  );
};

export default memo(MonacoEditor);
