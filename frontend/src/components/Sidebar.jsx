import { memo } from "react";
import { LANGUAGES } from "../constants/languages";

const Sidebar = ({
  roomId,
  users,
  language,
  typingIndicator,
  onCopyRoomId,
  onLanguageChange,
  onLeaveRoom,
  copySuccess,
}) => {
  return (
    <div className="sidebar">
      <div className="room-info">
        <h2>Code Room: {roomId}</h2>
        <button onClick={onCopyRoomId} className="copy-button">
          Copy Id
        </button>
        {copySuccess && <span className="copy-success">{copySuccess}</span>}
      </div>

      <h3>Users in Room:</h3>
      <ul>
        {users.map((userName, index) => (
          <li key={`${userName}-${index}`}>{userName.slice(0, 8)}...</li>
        ))}
      </ul>

      {typingIndicator && <p className="typing-indicator">{typingIndicator}</p>}

      <select
        className="language-selector"
        value={language}
        onChange={onLanguageChange}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>

      <button className="leave-button" onClick={onLeaveRoom}>
        Leave Room
      </button>
    </div>
  );
};

export default memo(Sidebar);
