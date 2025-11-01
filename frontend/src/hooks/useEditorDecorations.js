import { useEffect, useRef } from "react";
import { getUserColor } from "../utils/colors";

const createCursorDecoration = (monaco, position, user, color) => {
  const safeUser = user.replace(/[^a-zA-Z0-9]/g, "");

  const decoration = {
    range: new monaco.Range(
      position.lineNumber,
      position.column,
      position.lineNumber,
      position.column
    ),
    options: {
      className: "",
      glyphMarginClassName: "",
      beforeContentClassName: `remote-cursor-${safeUser}`,
    },
  };

  const cursorStyleId = `remote-cursor-style-${safeUser}`;
  let cursorStyleElement = document.getElementById(cursorStyleId);
  if (!cursorStyleElement) {
    cursorStyleElement = document.createElement("style");
    cursorStyleElement.id = cursorStyleId;
    document.head.appendChild(cursorStyleElement);
  }
  cursorStyleElement.textContent = `
    .remote-cursor-${safeUser}::before {
      content: '';
      position: absolute;
      width: 2px;
      height: 18px;
      background-color: ${color.hex};
      animation: blink-${safeUser} 1s infinite;
      z-index: 1000;
    }
    .remote-cursor-${safeUser}::after {
      content: '${user.substring(0, 8)}';
      position: absolute;
      top: -18px;
      left: 0;
      background-color: ${color.hex};
      color: white;
      padding: 2px 4px;
      border-radius: 2px;
      font-size: 10px;
      white-space: nowrap;
      z-index: 1001;
      pointer-events: none;
    }
    @keyframes blink-${safeUser} {
      0%, 49% { opacity: 1; }
      50%, 100% { opacity: 0; }
    }
  `;

  return decoration;
};

const createSelectionDecoration = (monaco, selection, user, color) => {
  const safeUser = user.replace(/[^a-zA-Z0-9]/g, "");

  const decoration = {
    range: new monaco.Range(
      selection.startLineNumber,
      selection.startColumn,
      selection.endLineNumber,
      selection.endColumn
    ),
    options: {
      className: `remote-selection-${safeUser}`,
      inlineClassName: `remote-selection-inline`,
      isWholeLine: false,
      linesDecorationsClassName: "",
    },
  };

  const styleId = `remote-selection-style-${safeUser}`;
  let styleElement = document.getElementById(styleId);
  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }
  styleElement.textContent = `
    .remote-selection-${safeUser} {
      background-color: ${color.hex}33 !important;
    }
    .remote-selection-inline {
      background-color: transparent !important;
    }
  `;

  return decoration;
};

export const useEditorDecorations = (
  editorRef,
  monacoRef,
  userName,
  remoteCursors,
  remoteSelections
) => {
  const decorationsRef = useRef([]);

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;

    const editor = editorRef.current;
    const monaco = monacoRef.current;
    const newDecorations = [];

    remoteSelections.forEach((selection, user) => {
      if (user === userName) return;

      const color = getUserColor(user);
      const decoration = createSelectionDecoration(
        monaco,
        selection,
        user,
        color
      );
      newDecorations.push(decoration);
    });

    remoteCursors.forEach((position, user) => {
      if (user === userName) return;

      const color = getUserColor(user);
      const decoration = createCursorDecoration(monaco, position, user, color);
      newDecorations.push(decoration);
    });

    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      newDecorations
    );
  }, [editorRef, monacoRef, remoteCursors, remoteSelections, userName]);

  return decorationsRef;
};
