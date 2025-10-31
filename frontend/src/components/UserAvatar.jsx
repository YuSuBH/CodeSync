import { memo } from "react";
import { getUserColor, getInitials } from "../utils/colors";

const UserAvatar = ({ username, size = "md", showName = false }) => {
  const color = getUserColor(username);
  const initials = getInitials(username);

  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeClasses[size]} ${color.bg} rounded-full flex items-center justify-center text-white font-bold shadow-md`}
        title={username}
      >
        {initials}
      </div>
      {showName && (
        <span className="text-sm font-medium truncate">{username}</span>
      )}
    </div>
  );
};

export default memo(UserAvatar);
