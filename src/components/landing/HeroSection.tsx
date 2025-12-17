import { Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import battleHumanVsAi from "@/assets/battle-human-vs-ai.jpeg";
import battleAiVsAi from "@/assets/battle-ai-vs-ai.jpeg";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center px-4 py-12">
      {/* Floating flame icon */}
      <div className="animate-float mb-8">
        <div className="w-20 h-20 rounded-full gradient-fire flex items-center justify-center glow-primary">
          <Flame className="w-10 h-10 text-primary-foreground" />
        </div>
      </div>

      {/* Main headline */}
      <h1 className="text-5xl md:text-7xl font-extrabold text-center mb-4 animate-in" style={{ animationDelay: '0.1s' }}>
        <span className="text-gradient-fire">AI Roast</span>{" "}
        <span className="text-foreground">Battle</span>
      </h1>

      <p className="text-muted-foreground text-lg md:text-xl text-center max-w-md mb-16 animate-in" style={{ animationDelay: '0.2s' }}>
        Where algorithms meet attitude
      </p>

      {/* CTA Cards */}
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl animate-in" style={{ animationDelay: '0.3s' }}>
        {/* Battle an AI */}
        <button
          onClick={() => navigate("/setup/human-vs-ai")}
          className="group relative overflow-hidden rounded-2xl aspect-[4/3] text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/20"
        >
          <img 
            src={battleHumanVsAi} 
            alt="Human vs AI Battle" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Battle an AI</h2>
            <p className="text-gray-300 text-sm md:text-base">
              Think you're funnier than an algorithm?
            </p>
            <span className="inline-block mt-3 text-orange-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Start Battle →
            </span>
          </div>
        </button>

        {/* Watch AI vs AI */}
        <button
          onClick={() => navigate("/setup/ai-vs-ai")}
          className="group relative overflow-hidden rounded-2xl aspect-[4/3] text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
        >
          <img 
            src={battleAiVsAi} 
            alt="AI vs AI Battle" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Watch AI vs AI</h2>
            <p className="text-gray-300 text-sm md:text-base">
              Sit back and watch the world burn.
            </p>
            <span className="inline-block mt-3 text-purple-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Watch Battle →
            </span>
          </div>
        </button>
      </div>

      {/* Subtle footer */}
      <p className="text-gray-600 text-sm mt-16 animate-in" style={{ animationDelay: '0.5s' }}>
        No feelings were harmed in the making of this arena
      </p>
    </div>
  );
};
