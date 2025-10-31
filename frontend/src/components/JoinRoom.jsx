import { useState } from "react";

const JoinRoom = ({ onJoin }) => {
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
        className="bg-white p-8 rounded-lg shadow-md text-center w-[300px]"
        onSubmit={handleSubmit}
      >
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
          className="w-full p-3 bg-green-500 text-white border-none rounded text-base cursor-pointer hover:bg-green-600 transition-colors"
        >
          Join Room
        </button>
      </form>
    </div>
  );
};

export default JoinRoom;
