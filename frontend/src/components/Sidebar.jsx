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
    <div className="w-64 bg-slate-700 text-white p-6 flex flex-col overflow-y-auto">
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-lg font-semibold mb-3 text-center break-all">
          Room: {roomId}
        </h2>
        <button
          onClick={onCopyRoomId}
          className="px-4 py-2 bg-blue-500 rounded text-white cursor-pointer hover:bg-blue-600 transition-colors text-sm"
        >
          Copy Room ID
        </button>
        {copySuccess && (
          <span className="mt-2 text-green-400 text-sm font-medium">
            {copySuccess}
          </span>
        )}
      </div>

      <h3 className="mb-3 text-base font-semibold">
        Users in Room: ({users.length})
      </h3>
      <ul className="list-none p-0 m-0 space-y-2 mb-4">
        {users.length > 0 ? (
          users.map((userName, index) => (
            <li
              key={`${userName}-${index}`}
              className="p-2 text-sm bg-gray-600 rounded truncate"
              title={userName}
            >
              {userName}
            </li>
          ))
        ) : (
          <li className="p-2 text-sm text-gray-400 italic">No users yet</li>
        )}
      </ul>

      {typingIndicator && (
        <p className="mb-4 text-sm text-green-300 italic">{typingIndicator}</p>
      )}

      <div className="mt-auto">
        <label className="block mb-2 text-sm font-semibold">Language:</label>
        <select
          className="w-full p-2 bg-slate-600 text-white border border-slate-500 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          value={language}
          onChange={onLanguageChange}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>

        <button
          className="w-full p-3 bg-red-600 text-white rounded text-base cursor-pointer hover:bg-red-700 transition-colors"
          onClick={onLeaveRoom}
        >
          Leave Room
        </button>
      </div>
    </div>
  );
};

export default memo(Sidebar);
