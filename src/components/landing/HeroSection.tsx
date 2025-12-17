import { Flame, Swords, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl animate-in" style={{ animationDelay: '0.3s' }}>
        {/* Battle an AI */}
        <button
          onClick={() => navigate("/setup/human-vs-ai")}
          className="card-battle group text-left"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl gradient-fire flex items-center justify-center group-hover:scale-110 transition-transform">
              <Swords className="w-7 h-7 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Battle an AI</h2>
          </div>
          <p className="text-muted-foreground text-base leading-relaxed">
            Think you're funnier than an algorithm?
          </p>
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-primary text-sm font-medium">Start →</span>
          </div>
        </button>

        {/* Watch AI vs AI */}
        <button
          onClick={() => navigate("/setup/ai-vs-ai")}
          className="card-battle group text-left"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
              <Eye className="w-7 h-7 text-secondary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Watch AI vs AI</h2>
          </div>
          <p className="text-muted-foreground text-base leading-relaxed">
            Sit back and watch the world burn.
          </p>
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-secondary text-sm font-medium">Watch →</span>
          </div>
        </button>
      </div>

      {/* Subtle footer */}
      <p className="text-muted-foreground/50 text-sm mt-16 animate-in" style={{ animationDelay: '0.5s' }}>
        No feelings were harmed in the making of this arena
      </p>
    </div>
  );
};
