import { useCallback, useRef } from "react";
import { CURSOR_UPDATE_THROTTLE } from "../constants/socket";

export const useEditorEvents = (
  roomId,
  userName,
  onCursorChange,
  onSelectionChange
) => {
  const cursorThrottleRef = useRef(null);
  const isUserInteractingRef = useRef(false);

  const setupEditorListeners = useCallback(
    (editor) => {
      editor.onDidFocusEditorText(() => {
        isUserInteractingRef.current = true;
      });

      editor.onDidBlurEditorText(() => {
        isUserInteractingRef.current = false;
      });

      editor.onDidChangeCursorPosition((e) => {
        if (e.source === "modelChange" || e.source === "api") {
          return;
        }

        if (cursorThrottleRef.current) {
          clearTimeout(cursorThrottleRef.current);
        }

        cursorThrottleRef.current = setTimeout(() => {
          const position = {
            lineNumber: e.position.lineNumber,
            column: e.position.column,
          };
          onCursorChange(roomId, userName, position);
        }, CURSOR_UPDATE_THROTTLE);
      });

      editor.onDidChangeCursorSelection((e) => {
        const selection = e.selection;
        if (
          selection.startLineNumber !== selection.endLineNumber ||
          selection.startColumn !== selection.endColumn
        ) {
          onSelectionChange(roomId, userName, {
            startLineNumber: selection.startLineNumber,
            startColumn: selection.startColumn,
            endLineNumber: selection.endLineNumber,
            endColumn: selection.endColumn,
          });
        } else {
          onSelectionChange(roomId, userName, null);
        }
      });
    },
    [roomId, userName, onCursorChange, onSelectionChange]
  );

  return { setupEditorListeners };
};
