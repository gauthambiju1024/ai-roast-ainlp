import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface TranscriptViewerProps {
  threadText: string;
}

export const TranscriptViewer = ({ threadText }: TranscriptViewerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const lines = threadText.split("\n").filter(Boolean);

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <span className="text-sm font-medium text-foreground">View Transcript</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      
      {isExpanded && (
        <div className="p-4 bg-card max-h-64 overflow-y-auto space-y-2">
          {lines.map((line, index) => {
            const isA = line.startsWith("A:");
            const isB = line.startsWith("B:");
            return (
              <p
                key={index}
                className={cn(
                  "text-sm py-1 px-2 rounded",
                  isA && "bg-primary/10 text-foreground",
                  isB && "bg-secondary/10 text-foreground",
                  !isA && !isB && "text-muted-foreground"
                )}
              >
                {line}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
};
