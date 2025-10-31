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
    <div className="join-container">
      <form className="join-form" onSubmit={handleSubmit}>
        <h1>Join Code Room</h1>
        <input
          type="text"
          placeholder="Room Id"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Your Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <button type="submit">Join Room</button>
      </form>
    </div>
  );
};

export default JoinRoom;
