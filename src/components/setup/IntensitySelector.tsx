import { cn } from "@/lib/utils";
import { INTENSITIES, Intensity } from "@/config/battleConfig";

interface IntensitySelectorProps {
  selectedIntensity: string;
  onSelect: (intensity: string) => void;
}

export const IntensitySelector = ({
  selectedIntensity,
  onSelect,
}: IntensitySelectorProps) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-muted-foreground">Roast Intensity</label>
      <div className="flex gap-3">
        {INTENSITIES.map((intensity) => (
          <button
            key={intensity.id}
            onClick={() => onSelect(intensity.id)}
            className={cn(
              "flex-1 py-3 px-4 rounded-xl border-2 transition-all duration-300",
              "flex items-center justify-center gap-2",
              selectedIntensity === intensity.id
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/50"
            )}
          >
            <span>{intensity.emoji}</span>
            <span className="font-medium">{intensity.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
