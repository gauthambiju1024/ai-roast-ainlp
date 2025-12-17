import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Flame, Plus, X } from "lucide-react";
import { PersonalityCard } from "@/components/setup/PersonalityCard";
import { IntensitySelector } from "@/components/setup/IntensitySelector";
import { TimeLimitSelector } from "@/components/setup/TimeLimitSelector";
import { PERSONALITIES, TIME_LIMITS, HUMAN_VIBES } from "@/config/battleConfig";
import { useBattleStore } from "@/store/battleStore";
import { Input } from "@/components/ui/input";
const SetupHumanVsAI = () => {
  const navigate = useNavigate();
  const initBattle = useBattleStore(state => state.initBattle);

  // Human profile state
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [customDescription, setCustomDescription] = useState("");
  const [customVibe, setCustomVibe] = useState("");
  const [showCustomVibeInput, setShowCustomVibeInput] = useState(false);

  // Battle config state
  const [selectedPersonality, setSelectedPersonality] = useState<string>("");
  const [selectedIntensity, setSelectedIntensity] = useState("mild");
  const [selectedTimeLimit, setSelectedTimeLimit] = useState("standard");
  const toggleVibe = (vibeId: string) => {
    setSelectedVibes(prev => prev.includes(vibeId) ? prev.filter(v => v !== vibeId) : [...prev, vibeId]);
  };
  const addCustomVibe = () => {
    if (customVibe.trim() && !selectedVibes.includes(customVibe.trim())) {
      setSelectedVibes(prev => [...prev, customVibe.trim()]);
      setCustomVibe("");
      setShowCustomVibeInput(false);
    }
  };
  const removeCustomVibe = (vibe: string) => {
    setSelectedVibes(prev => prev.filter(v => v !== vibe));
  };
  const handleStartBattle = () => {
    const timeConfig = TIME_LIMITS.find(t => t.id === selectedTimeLimit);

    // Build vibes labels for context
    const vibeLabels = selectedVibes.map(v => {
      const preset = HUMAN_VIBES.find(hv => hv.id === v);
      return preset ? preset.label : v; // Use label for presets, raw value for custom
    });
    initBattle({
      mode: "human_vs_ai",
      participantBPersonality: selectedPersonality,
      intensity: selectedIntensity,
      timeLimit: timeConfig?.seconds || 60,
      humanProfile: {
        vibes: vibeLabels,
        customDescription: customDescription.trim() || undefined
      }
    });
    navigate("/battle");
  };
  const isValid = selectedPersonality !== "";

  // Get custom vibes (vibes not in HUMAN_VIBES)
  const customVibes = selectedVibes.filter(v => !HUMAN_VIBES.find(hv => hv.id === v));
  return <div className="min-h-screen gradient-hero">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Human Profile Section */}
        <div className="animate-in mb-8" style={{
        animationDelay: '0.1s'
      }}>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Tell Us About Yourself
          </h1>
          <p className="text-muted-foreground mb-6">
            Give the AI something to roast!
          </p>

          {/* Vibe Chips */}
          <div className="space-y-3 mb-6">
            <label className="text-sm font-medium text-foreground">
              Pick Your Vibe <span className="text-muted-foreground">(tap all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {HUMAN_VIBES.map(vibe => <button key={vibe.id} onClick={() => toggleVibe(vibe.id)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedVibes.includes(vibe.id) ? "bg-primary text-primary-foreground scale-105" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                  {vibe.emoji} {vibe.label}
                </button>)}
              
              {/* Custom vibes */}
              {customVibes.map(vibe => <button key={vibe} onClick={() => removeCustomVibe(vibe)} className="px-3 py-1.5 rounded-full text-sm font-medium bg-secondary text-secondary-foreground flex items-center gap-1 group">
                  {vibe}
                  <X className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                </button>)}
              
              {/* Add custom vibe button */}
              {!showCustomVibeInput ? <button onClick={() => setShowCustomVibeInput(true)} className="px-3 py-1.5 rounded-full text-sm font-medium border border-dashed border-muted-foreground/50 text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add your own
                </button> : <div className="flex items-center gap-2">
                  <Input value={customVibe} onChange={e => setCustomVibe(e.target.value)} placeholder="Type your vibe..." maxLength={20} className="w-32 h-8 text-sm" onKeyDown={e => e.key === "Enter" && addCustomVibe()} autoFocus />
                  <button onClick={addCustomVibe} disabled={!customVibe.trim()} className="h-8 px-2 rounded bg-primary text-primary-foreground text-sm disabled:opacity-50">
                    Add
                  </button>
                  <button onClick={() => {
                setShowCustomVibeInput(false);
                setCustomVibe("");
              }} className="h-8 px-2 rounded bg-muted text-muted-foreground text-sm">
                    Cancel
                  </button>
                </div>}
            </div>
          </div>

          {/* Custom Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Anything else? <span className="text-muted-foreground">(optional)</span>
            </label>
            <Input value={customDescription} onChange={e => setCustomDescription(e.target.value)} placeholder="Add a one-liner about yourself..." maxLength={100} className="bg-background/50" />
            <p className="text-xs text-muted-foreground text-right">{customDescription.length}/100</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8" />

        {/* Personality Selection */}
        <div className="animate-in" style={{
        animationDelay: '0.2s'
      }}>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Choose Your Opponent
          </h2>
          <p className="text-muted-foreground mb-6">
            Select an AI personality to roast battle against
          </p>
          
          <div className="space-y-4 mb-8">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PERSONALITIES.map(personality => <PersonalityCard key={personality.id} personality={personality} isSelected={selectedPersonality === personality.id} onSelect={() => setSelectedPersonality(personality.id)} />)}
            </div>
          </div>
        </div>

        {/* Intensity & Time */}
        <div className="space-y-6 mb-8 animate-in" style={{
        animationDelay: '0.3s'
      }}>
          <IntensitySelector selectedIntensity={selectedIntensity} onSelect={setSelectedIntensity} />
          <TimeLimitSelector selectedTimeLimit={selectedTimeLimit} onSelect={setSelectedTimeLimit} />
        </div>

        {/* Start Button */}
        <button onClick={handleStartBattle} disabled={!isValid} className="w-full btn-fire flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 animate-in" style={{
        animationDelay: '0.4s'
      }}>
          <Flame className="w-5 h-5" />
          Start Battle
        </button>
      </div>
    </div>;
};
export default SetupHumanVsAI;