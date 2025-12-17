import { Flame, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import battleHumanVsAi from "@/assets/battle-human-vs-ai.jpeg";
import battleAiVsAi from "@/assets/battle-ai-vs-ai.jpeg";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-6 py-16 md:py-24">
      {/* Logo/Icon */}
      <div className="mb-12">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
          <Flame className="w-8 h-8 text-white" strokeWidth={1.5} />
        </div>
      </div>

      {/* Main headline */}
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-4 tracking-tight">
        <span className="text-foreground">AI Roast Battle</span>
      </h1>

      <p className="text-muted-foreground text-base md:text-lg text-center max-w-sm mb-16">
        Where algorithms meet attitude
      </p>

      {/* CTA Cards */}
      <div className="grid md:grid-cols-2 gap-5 w-full max-w-3xl">
        {/* Battle an AI */}
        <button
          onClick={() => navigate("/setup/human-vs-ai")}
          className="group relative overflow-hidden rounded-xl bg-card border border-border hover:border-orange-500/50 transition-all duration-200"
        >
          <div className="aspect-[16/10] overflow-hidden">
            <img 
              src={battleHumanVsAi} 
              alt="Human vs AI Battle" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-5 flex items-center justify-between">
            <div className="text-left">
              <h2 className="text-lg font-semibold text-foreground mb-1">Battle an AI</h2>
              <p className="text-muted-foreground text-sm">
                Think you're funnier than an algorithm?
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
              <ArrowRight className="w-5 h-5 text-orange-500 group-hover:text-white transition-colors" />
            </div>
          </div>
        </button>

        {/* Watch AI vs AI */}
        <button
          onClick={() => navigate("/setup/ai-vs-ai")}
          className="group relative overflow-hidden rounded-xl bg-card border border-border hover:border-purple-500/50 transition-all duration-200"
        >
          <div className="aspect-[16/10] overflow-hidden">
            <img 
              src={battleAiVsAi} 
              alt="AI vs AI Battle" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-5 flex items-center justify-between">
            <div className="text-left">
              <h2 className="text-lg font-semibold text-foreground mb-1">Watch AI vs AI</h2>
              <p className="text-muted-foreground text-sm">
                Sit back and watch the world burn.
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500 transition-colors">
              <ArrowRight className="w-5 h-5 text-purple-500 group-hover:text-white transition-colors" />
            </div>
          </div>
        </button>
      </div>

      {/* Footer */}
      <p className="text-muted-foreground/50 text-xs mt-16">
        No feelings were harmed in the making of this arena
      </p>
    </div>
  );
};
