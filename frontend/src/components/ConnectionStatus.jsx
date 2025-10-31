import { memo } from "react";

const ConnectionStatus = ({ isConnected }) => {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-md">
      <div
        className={`w-2 h-2 rounded-full ${
          isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
        }`}
      />
      <span className="text-xs text-white font-medium">
        {isConnected ? "Connected" : "Disconnected"}
      </span>
    </div>
  );
};

export default memo(ConnectionStatus);
