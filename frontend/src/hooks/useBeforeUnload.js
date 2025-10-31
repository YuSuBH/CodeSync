import { useEffect } from "react";

export const useBeforeUnload = (callback) => {
  useEffect(() => {
    const handleBeforeUnload = () => {
      callback();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [callback]);
};
