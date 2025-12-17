import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Flame } from "lucide-react";
import { PersonalityCard } from "@/components/setup/PersonalityCard";
import { IntensitySelector } from "@/components/setup/IntensitySelector";
import { TimeLimitSelector } from "@/components/setup/TimeLimitSelector";
import { PERSONALITIES, TIME_LIMITS } from "@/config/battleConfig";
import { useBattleStore } from "@/store/battleStore";

const SetupHumanVsAI = () => {
  const navigate = useNavigate();
  const initBattle = useBattleStore((state) => state.initBattle);
  
  const [selectedPersonality, setSelectedPersonality] = useState<string>("");
  const [selectedIntensity, setSelectedIntensity] = useState("mild");
  const [selectedTimeLimit, setSelectedTimeLimit] = useState("standard");

  const handleStartBattle = () => {
    const timeConfig = TIME_LIMITS.find((t) => t.id === selectedTimeLimit);
    
    initBattle({
      mode: "human_vs_ai",
      participantBPersonality: selectedPersonality,
      intensity: selectedIntensity,
      timeLimit: timeConfig?.seconds || 60,
    });
    
    navigate("/battle");
  };

  const isValid = selectedPersonality !== "";

  return (
    <div className="min-h-screen gradient-hero">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="animate-in" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Choose Your Opponent
          </h1>
          <p className="text-muted-foreground mb-8">
            Select an AI personality to roast battle against
          </p>
        </div>

        {/* Personality Selection */}
        <div className="space-y-4 mb-8 animate-in" style={{ animationDelay: '0.2s' }}>
          <label className="text-sm font-medium text-muted-foreground">AI Personality</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PERSONALITIES.map((personality) => (
              <PersonalityCard
                key={personality.id}
                personality={personality}
                isSelected={selectedPersonality === personality.id}
                onSelect={() => setSelectedPersonality(personality.id)}
              />
            ))}
          </div>
        </div>

        {/* Intensity & Time */}
        <div className="space-y-6 mb-8 animate-in" style={{ animationDelay: '0.3s' }}>
          <IntensitySelector
            selectedIntensity={selectedIntensity}
            onSelect={setSelectedIntensity}
          />
          <TimeLimitSelector
            selectedTimeLimit={selectedTimeLimit}
            onSelect={setSelectedTimeLimit}
          />
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartBattle}
          disabled={!isValid}
          className="w-full btn-fire flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 animate-in"
          style={{ animationDelay: '0.4s' }}
        >
          <Flame className="w-5 h-5" />
          Start Battle
        </button>
      </div>
    </div>
  );
};

export default SetupHumanVsAI;
