import { cn } from "@/lib/utils";
import { Personality } from "@/config/battleConfig";

interface PersonalityCardProps {
  personality: Personality;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export const PersonalityCard = ({
  personality,
  isSelected,
  onSelect,
  disabled = false,
}: PersonalityCardProps) => {
  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        "relative p-4 rounded-xl border-2 transition-all duration-300 text-left w-full",
        "hover:scale-[1.02] active:scale-[0.98]",
        isSelected
          ? "border-primary bg-primary/10 glow-primary"
          : "border-border bg-card hover:border-primary/50",
        disabled && "opacity-50 cursor-not-allowed hover:scale-100"
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{personality.emoji}</span>
        <div>
          <h3 className="font-semibold text-foreground">{personality.name}</h3>
          <p className="text-sm text-muted-foreground">{personality.description}</p>
        </div>
      </div>
      {isSelected && (
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full gradient-fire" />
      )}
    </button>
  );
};
