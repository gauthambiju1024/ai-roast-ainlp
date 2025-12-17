import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye } from "lucide-react";
import { PersonalityCard } from "@/components/setup/PersonalityCard";
import { IntensitySelector } from "@/components/setup/IntensitySelector";
import { PERSONALITIES } from "@/config/battleConfig";
import { useBattleStore } from "@/store/battleStore";

const SetupAIvsAI = () => {
  const navigate = useNavigate();
  const initBattle = useBattleStore((state) => state.initBattle);
  
  const [selectedPersonalityA, setSelectedPersonalityA] = useState<string>("");
  const [selectedPersonalityB, setSelectedPersonalityB] = useState<string>("");
  const [selectedIntensity, setSelectedIntensity] = useState("mild");

  const handleStartBattle = () => {
    initBattle({
      mode: "ai_vs_ai",
      participantAPersonality: selectedPersonalityA,
      participantBPersonality: selectedPersonalityB,
      intensity: selectedIntensity,
      timeLimit: 120, // Fixed longer time for AI vs AI
    });
    
    navigate("/battle");
  };

  const isValid = selectedPersonalityA !== "" && selectedPersonalityB !== "" && selectedPersonalityA !== selectedPersonalityB;

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
            Pick the Fighters
          </h1>
          <p className="text-muted-foreground mb-8">
            Select two AI personalities to watch them battle
          </p>
        </div>

        {/* Personality A Selection */}
        <div className="space-y-4 mb-8 animate-in" style={{ animationDelay: '0.2s' }}>
          <label className="text-sm font-medium text-muted-foreground">
            Fighter A <span className="text-primary">(attacks first)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PERSONALITIES.map((personality) => (
              <PersonalityCard
                key={personality.id}
                personality={personality}
                isSelected={selectedPersonalityA === personality.id}
                onSelect={() => setSelectedPersonalityA(personality.id)}
                disabled={selectedPersonalityB === personality.id}
              />
            ))}
          </div>
        </div>

        {/* Personality B Selection */}
        <div className="space-y-4 mb-8 animate-in" style={{ animationDelay: '0.3s' }}>
          <label className="text-sm font-medium text-muted-foreground">
            Fighter B <span className="text-secondary">(counter-attacks)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PERSONALITIES.map((personality) => (
              <PersonalityCard
                key={personality.id}
                personality={personality}
                isSelected={selectedPersonalityB === personality.id}
                onSelect={() => setSelectedPersonalityB(personality.id)}
                disabled={selectedPersonalityA === personality.id}
              />
            ))}
          </div>
        </div>

        {/* Intensity */}
        <div className="space-y-6 mb-8 animate-in" style={{ animationDelay: '0.4s' }}>
          <IntensitySelector
            selectedIntensity={selectedIntensity}
            onSelect={setSelectedIntensity}
          />
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartBattle}
          disabled={!isValid}
          className="w-full py-4 px-8 rounded-xl font-semibold bg-secondary text-secondary-foreground flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all animate-in"
          style={{ animationDelay: '0.5s' }}
        >
          <Eye className="w-5 h-5" />
          Watch Battle
        </button>
      </div>
    </div>
  );
};

export default SetupAIvsAI;
