import { memo } from "react";
import ExecuteButton from "./ExecuteButton";

const OutputPanel = ({ output, isExecuting, onExecute }) => {
  return (
    <div className="h-full p-4 flex flex-col bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-700">Output</h3>
        <ExecuteButton isExecuting={isExecuting} onExecute={onExecute} />
      </div>
      <textarea
        className="flex-1 p-3 border border-gray-300 rounded text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        value={output}
        readOnly
        placeholder="Output will be shown here..."
      />
    </div>
  );
};

export default memo(OutputPanel);
