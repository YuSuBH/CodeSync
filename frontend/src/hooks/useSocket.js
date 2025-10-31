import { useEffect, useRef } from "react";
import io from "socket.io-client";
import { SOCKET_URL } from "../constants/socket";

export const useSocket = () => {
  const socketRef = useRef(null);

  if (!socketRef.current) {
    console.log("Creating new socket connection to", SOCKET_URL);
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  }

  useEffect(() => {
    const socket = socketRef.current;

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return socketRef.current;
};
