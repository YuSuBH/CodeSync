const USER_COLORS = [
  { bg: "bg-blue-500", text: "text-blue-500", hex: "#3B82F6" },
  { bg: "bg-green-500", text: "text-green-500", hex: "#10B981" },
  { bg: "bg-purple-500", text: "text-purple-500", hex: "#8B5CF6" },
  { bg: "bg-pink-500", text: "text-pink-500", hex: "#EC4899" },
  { bg: "bg-orange-500", text: "text-orange-500", hex: "#F97316" },
  { bg: "bg-teal-500", text: "text-teal-500", hex: "#14B8A6" },
  { bg: "bg-red-500", text: "text-red-500", hex: "#EF4444" },
  { bg: "bg-indigo-500", text: "text-indigo-500", hex: "#6366F1" },
  { bg: "bg-yellow-500", text: "text-yellow-500", hex: "#EAB308" },
  { bg: "bg-cyan-500", text: "text-cyan-500", hex: "#06B6D4" },
];

const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

export const getUserColor = (username) => {
  const hash = hashString(username);
  const index = hash % USER_COLORS.length;
  return USER_COLORS[index];
};

export const getInitials = (username) => {
  if (!username) return "?";
  const parts = username.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return username.substring(0, 2).toUpperCase();
};
