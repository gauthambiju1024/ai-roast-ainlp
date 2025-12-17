import { useState } from "react";
import { ChevronDown, ChevronUp, Bug } from "lucide-react";

interface DevPanelProps {
  requestPayload: object | null;
  responseData: object | null;
}

export const DevPanel = ({ requestPayload, responseData }: DevPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Only show in development
  if (import.meta.env.PROD) return null;

  return (
    <div className="border border-yellow-500/30 rounded-xl overflow-hidden bg-yellow-500/5">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2 flex items-center justify-between hover:bg-yellow-500/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Bug className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium text-yellow-500">Dev Tools</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-yellow-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-yellow-500" />
        )}
      </button>
      
      {isExpanded && (
        <div className="p-4 space-y-4 text-xs font-mono">
          <div>
            <p className="text-yellow-500 mb-1 font-semibold">Request Payload:</p>
            <pre className="bg-card p-2 rounded overflow-x-auto text-foreground">
              {requestPayload ? JSON.stringify(requestPayload, null, 2) : "No request yet"}
            </pre>
          </div>
          <div>
            <p className="text-yellow-500 mb-1 font-semibold">Response Data:</p>
            <pre className="bg-card p-2 rounded overflow-x-auto text-foreground">
              {responseData ? JSON.stringify(responseData, null, 2) : "No response yet"}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
