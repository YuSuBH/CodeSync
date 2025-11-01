import { memo } from "react";

const ExecuteButton = ({ isExecuting, onExecute }) => {
  return (
    <button
      className={`px-4 py-2 rounded text-base transition-colors ${
        isExecuting
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-500 hover:bg-green-600 cursor-pointer"
      } text-white font-medium`}
      onClick={onExecute}
      disabled={isExecuting}
    >
      {isExecuting ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Executing...
        </span>
      ) : (
        "▶ Execute"
      )}
    </button>
  );
};

export default memo(ExecuteButton);
