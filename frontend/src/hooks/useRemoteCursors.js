import { useState, useCallback, useRef } from "react";

export const useRemoteCursors = () => {
  const [remoteCursors, setRemoteCursors] = useState(new Map());
  const [remoteSelections, setRemoteSelections] = useState(new Map());
  const cursorsTimeoutRef = useRef(new Map());

  const updateCursor = useCallback((userName, position) => {
    console.log(
      `[useRemoteCursors] Updating cursor for "${userName}" at line ${position.lineNumber}, col ${position.column}`
    );

    setRemoteCursors((prev) => {
      const newMap = new Map(prev);
      newMap.set(userName, position);
      console.log(
        `[useRemoteCursors] Updated cursor map, now has ${newMap.size} cursors:`,
        Array.from(newMap.keys())
      );
      return newMap;
    });

    if (cursorsTimeoutRef.current.has(userName)) {
      clearTimeout(cursorsTimeoutRef.current.get(userName));
      console.log(
        `[useRemoteCursors] Cleared existing timeout for "${userName}"`
      );
    }

    const timeout = setTimeout(() => {
      console.log(
        `[useRemoteCursors] Timeout reached - removing cursor for "${userName}"`
      );
      setRemoteCursors((prev) => {
        const newMap = new Map(prev);
        newMap.delete(userName);
        console.log(
          `[useRemoteCursors] After timeout removal, ${newMap.size} cursors remain:`,
          Array.from(newMap.keys())
        );
        return newMap;
      });
      cursorsTimeoutRef.current.delete(userName);
    }, 5000);

    cursorsTimeoutRef.current.set(userName, timeout);
  }, []);

  const updateSelection = useCallback((userName, selection) => {
    setRemoteSelections((prev) => {
      const newMap = new Map(prev);
      if (
        selection &&
        (selection.startLineNumber !== selection.endLineNumber ||
          selection.startColumn !== selection.endColumn)
      ) {
        newMap.set(userName, selection);
      } else {
        newMap.delete(userName);
      }
      return newMap;
    });
  }, []);

  const removeUser = useCallback((userName) => {
    setRemoteCursors((prev) => {
      const newMap = new Map(prev);
      newMap.delete(userName);
      return newMap;
    });
    setRemoteSelections((prev) => {
      const newMap = new Map(prev);
      newMap.delete(userName);
      return newMap;
    });
    if (cursorsTimeoutRef.current.has(userName)) {
      clearTimeout(cursorsTimeoutRef.current.get(userName));
      cursorsTimeoutRef.current.delete(userName);
    }
  }, []);

  const clearAll = useCallback(() => {
    setRemoteCursors(new Map());
    setRemoteSelections(new Map());
    cursorsTimeoutRef.current.forEach((timeout) => clearTimeout(timeout));
    cursorsTimeoutRef.current.clear();
  }, []);

  return {
    remoteCursors,
    remoteSelections,
    updateCursor,
    updateSelection,
    removeUser,
    clearAll,
  };
};
