import { useState } from "react";
import ConnectionStatus from "./ConnectionStatus";

const JoinRoom = ({ onJoin, isConnected }) => {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomId.trim() && userName.trim()) {
      onJoin(roomId.trim(), userName.trim());
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        className="bg-white p-8 rounded-lg shadow-md text-center w-[300px] relative"
        onSubmit={handleSubmit}
      >
        <div className="absolute top-4 right-4">
          <ConnectionStatus isConnected={isConnected} />
        </div>
        <h1 className="mb-6 text-gray-800 text-2xl font-bold">
          Join Code Room
        </h1>
        <input
          type="text"
          placeholder="Room Id"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          placeholder="Your Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          disabled={!isConnected}
          className={`w-full p-3 text-white border-none rounded text-base transition-colors ${
            isConnected
              ? "bg-green-500 hover:bg-green-600 cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isConnected ? "Join Room" : "Connecting..."}
        </button>
      </form>
    </div>
  );
};

export default JoinRoom;
