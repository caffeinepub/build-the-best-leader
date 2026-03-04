import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  ChevronRight,
  Crown,
  Loader2,
  Monitor,
  Trophy,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGetLeaderboard, useSubmitEntry } from "./hooks/useQueries";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Step = "start" | "team" | "traits" | "results" | "leaderboard";

const ALL_TRAITS: { name: string; score: number }[] = [
  { name: "Drinks 5 Cups of Coffee a Day", score: 1 },
  { name: "Writes Motivational LinkedIn Posts", score: 0 },
  { name: 'Starts Meetings With "Big Idea!"', score: 2 },
  { name: "Uses Way Too Many Buzzwords", score: -2 },
  { name: "Always Carries a Fancy Notebook", score: 1 },
  { name: 'Sleeps 3 Hours Because "Hustle"', score: -1 },
  { name: 'Says "Let\'s Circle Back" Every Meeting', score: -1 },
  { name: "Gives Random Inspirational Speeches", score: 1 },
  { name: "Owns 7 Blazers", score: 0 },
  { name: "Thinks Every Idea Is Genius", score: -3 },
  { name: "Talks for 20 Minutes Without Pausing", score: -2 },
  { name: "Has a Vision Board for Everything", score: 1 },
  { name: "Changes Strategy Every Monday", score: -3 },
  { name: 'Calls Everything "Game Changing"', score: -1 },
  { name: "Brags About Being Busy All the Time", score: -2 },
  { name: 'Always Says "Trust the Process"', score: 1 },
  { name: "Schedules Meetings That Could Be Emails", score: -2 },
  { name: "Loves Whiteboard Brainstorms", score: 1 },
  { name: "Reads One Business Book and Becomes a Guru", score: -2 },
  { name: "Quotes Famous CEOs Constantly", score: 0 },
  { name: 'Starts Every Sentence With "In My Experience…"', score: -1 },
  { name: "Brings Snacks to Every Meeting", score: 2 },
  { name: "Always Asks the Team for Opinions", score: 3 },
  { name: "Actually Listens to Feedback", score: 3 },
  { name: "Admits When They're Wrong", score: 3 },
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Avatar Image ──────────────────────────────────────────────────────────────

const AVATAR_MAP = [
  {
    minScore: 10,
    src: "/assets/generated/avatar-visionary-hero-transparent.dim_400x400.png",
    label: "Visionary Hero leader avatar",
  },
  {
    minScore: 4,
    src: "/assets/generated/avatar-confident-leader-transparent.dim_400x400.png",
    label: "Confident Leader avatar",
  },
  {
    minScore: 0,
    src: "/assets/generated/avatar-average-leader-transparent.dim_400x400.png",
    label: "Average Leader avatar",
  },
  {
    minScore: Number.NEGATIVE_INFINITY,
    src: "/assets/generated/avatar-struggling-leader-transparent.dim_400x400.png",
    label: "Struggling Leader avatar",
  },
] as const;

function LeaderAvatar({ score }: { score: number }) {
  const avatar =
    AVATAR_MAP.find((a) => score >= a.minScore) ??
    AVATAR_MAP[AVATAR_MAP.length - 1];

  return (
    <img
      src={avatar.src}
      alt={avatar.label}
      className="w-36 h-36 object-contain drop-shadow-md"
    />
  );
}

// ─── Live Indicator ─────────────────────────────────────────────────────────────

function LiveIndicator({ className = "" }: { className?: string }) {
  return (
    <span
      data-ocid="leaderboard.live_indicator"
      className={`inline-flex items-center gap-1.5 ${className}`}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
      </span>
      <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">
        Live
      </span>
    </span>
  );
}

// ─── Host View ─────────────────────────────────────────────────────────────────

function HostView() {
  const { data: entries = [], isLoading } = useGetLeaderboard();
  const sorted = [...entries].sort(
    (a, b) => Number(b.totalScore) - Number(a.totalScore),
  );

  const rankDisplay = (i: number) => {
    if (i === 0) return <span className="text-4xl">🥇</span>;
    if (i === 1) return <span className="text-4xl">🥈</span>;
    if (i === 2) return <span className="text-4xl">🥉</span>;
    return (
      <span className="text-2xl font-black text-muted-foreground w-10 text-center">
        {i + 1}
      </span>
    );
  };

  return (
    <div
      data-ocid="host.leaderboard_view"
      className="min-h-screen bg-background flex flex-col"
    >
      {/* Header */}
      <header className="py-8 px-8 border-b border-gold/20 bg-surface-raised/50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-gold/30 flex items-center justify-center">
              <Crown className="w-9 h-9 text-gold" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground leading-tight">
                Build the Best Leader
              </h1>
              <p className="text-xl font-semibold text-muted-foreground">
                Live Leaderboard
              </p>
            </div>
          </div>
          <LiveIndicator className="scale-150 origin-right" />
        </div>
      </header>

      {/* Board */}
      <main className="flex-1 py-10 px-8">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div
              data-ocid="host.leaderboard.loading_state"
              className="flex flex-col items-center justify-center py-32 text-muted-foreground"
            >
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="text-2xl font-semibold">Loading scores...</p>
            </div>
          ) : sorted.length === 0 ? (
            <div
              data-ocid="host.leaderboard.empty_state"
              className="flex flex-col items-center justify-center py-32 text-muted-foreground"
            >
              <Crown className="w-16 h-16 mb-6 text-border" />
              <p className="text-3xl font-black mb-2">Waiting for teams...</p>
              <p className="text-xl">Scores will appear here as teams submit</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sorted.map((entry, i) => {
                const score = Number(entry.totalScore);
                return (
                  <motion.div
                    key={`${entry.teamName}-${i}`}
                    data-ocid={`host.leaderboard.row.${i + 1}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={`flex items-center gap-6 px-8 py-6 rounded-2xl border-2 ${
                      i === 0
                        ? "bg-primary/10 border-gold/40 shadow-gold"
                        : i === 1
                          ? "bg-card border-border/80"
                          : i === 2
                            ? "bg-card border-border/60"
                            : "bg-card/50 border-border/30"
                    }`}
                  >
                    {/* Rank */}
                    <div className="flex items-center justify-center w-14 flex-shrink-0">
                      {rankDisplay(i)}
                    </div>

                    {/* Rank number for top 3 */}
                    {i < 3 && (
                      <div className="w-10 flex-shrink-0 text-center">
                        <span className="text-xl font-black text-muted-foreground">
                          #{i + 1}
                        </span>
                      </div>
                    )}

                    {/* Team Name */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-black text-2xl truncate ${
                          i === 0 ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {entry.teamName}
                      </p>
                    </div>

                    {/* Score */}
                    <div
                      className={`text-4xl font-black flex-shrink-0 ${
                        score > 0
                          ? "text-primary"
                          : score < 0
                            ? "text-destructive"
                            : "text-muted-foreground"
                      }`}
                    >
                      {score > 0 ? "+" : ""}
                      {score}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center border-t border-gold/10">
        <p className="text-sm text-muted-foreground/50">
          © {new Date().getFullYear()}. Built with{" "}
          <span className="text-red-500/60">♥</span> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold/60 hover:text-gold transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}

// ─── Start Screen ──────────────────────────────────────────────────────────────

function StartScreen({ onStart }: { onStart: () => void }) {
  const handleHostView = () => {
    const url = window.location.href.split("?")[0];
    window.open(`${url}?host=true`, "_blank");
  };

  return (
    <motion.div
      key="start"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col items-center justify-center min-h-screen px-4 relative overflow-hidden"
    >
      {/* Decorative ray burst */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="ray-burst opacity-60" />
      </div>

      {/* Decorative circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-gold/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-gold/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-gold/20 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
        {/* Crown icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          className="mb-8"
        >
          <div className="w-24 h-24 rounded-full bg-surface-raised border-2 border-gold/30 flex items-center justify-center animate-pulse-gold">
            <Crown className="w-12 h-12 text-gold" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-2 gold-text-gradient leading-none">
            Build the Best
          </h1>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 gold-text-gradient leading-none">
            Leader
          </h1>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="w-32 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent mb-6"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-md"
        >
          Choose leadership traits and see who creates the best leader.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col items-center gap-3 w-full max-w-xs"
        >
          <Button
            data-ocid="start.primary_button"
            onClick={onStart}
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-10 py-6 rounded-2xl shadow-gold transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Start Game
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>

          <Button
            data-ocid="start.host_view_button"
            onClick={handleHostView}
            variant="outline"
            size="sm"
            className="w-full border-primary/30 text-primary/80 hover:bg-primary/5 hover:text-primary font-semibold rounded-xl transition-all duration-200"
          >
            <Monitor className="mr-2 w-4 h-4" />
            Host View — for projecting the leaderboard
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Team Name Screen ──────────────────────────────────────────────────────────

function TeamScreen({ onNext }: { onNext: (name: string) => void }) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onNext(name.trim());
  };

  return (
    <motion.div
      key="team"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col items-center justify-center min-h-screen px-4"
    >
      <div className="w-full max-w-md">
        {/* Step badge */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
            1
          </span>
          <span className="text-sm text-muted-foreground font-medium">
            Step 1 of 3
          </span>
        </div>

        <h2 className="text-3xl md:text-4xl font-black text-foreground mb-2 text-center">
          What's your team name?
        </h2>
        <p className="text-muted-foreground text-center mb-8">
          Enter your team name to get started.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            data-ocid="team.input"
            type="text"
            placeholder="e.g. Team Alpha"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-lg py-6 px-4 rounded-xl border-2 border-border focus:border-primary bg-card"
            autoFocus
            maxLength={40}
          />
          <Button
            data-ocid="team.submit_button"
            type="submit"
            disabled={!name.trim()}
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
          >
            Next — Choose Traits
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </form>
      </div>
    </motion.div>
  );
}

// ─── Trait Selection Screen ────────────────────────────────────────────────────

function TraitScreen({
  shuffledTraits,
  onSubmit,
}: {
  shuffledTraits: { name: string; score: number }[];
  onSubmit: (selected: string[], score: number) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const MAX = 5;

  const toggle = (name: string) => {
    setSelected((prev) => {
      if (prev.includes(name)) return prev.filter((t) => t !== name);
      if (prev.length >= MAX) return prev;
      return [...prev, name];
    });
  };

  const totalScore = selected.reduce((sum, name) => {
    const trait = ALL_TRAITS.find((t) => t.name === name);
    return sum + (trait?.score ?? 0);
  }, 0);

  const handleSubmit = () => {
    if (selected.length === MAX) onSubmit(selected, totalScore);
  };

  return (
    <motion.div
      key="traits"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col items-center min-h-screen px-4 py-12"
    >
      <div className="w-full max-w-2xl">
        {/* Step badge */}
        <div className="flex items-center gap-2 mb-6 justify-center">
          <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
            2
          </span>
          <span className="text-sm text-muted-foreground font-medium">
            Step 2 of 3
          </span>
        </div>

        <h2 className="text-3xl md:text-4xl font-black text-foreground mb-1 text-center">
          Choose 5 Leadership Traits
        </h2>
        <p className="text-muted-foreground text-center mb-2">
          Select exactly 5 traits that define your leader.
        </p>

        {/* Counter */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((slot) => (
              <div
                key={slot}
                className={`w-8 h-2 rounded-full transition-all duration-300 ${
                  slot <= selected.length ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>
          <span className="ml-3 text-sm font-semibold text-muted-foreground">
            {selected.length}/{MAX}
          </span>
        </div>

        {/* Trait grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {shuffledTraits.map((trait, idx) => {
            const isSelected = selected.includes(trait.name);
            const isDisabled = !isSelected && selected.length >= MAX;
            return (
              <motion.button
                key={trait.name}
                data-ocid={`trait.item.${idx + 1}`}
                onClick={() => !isDisabled && toggle(trait.name)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                whileTap={!isDisabled ? { scale: 0.96 } : {}}
                disabled={isDisabled}
                className={`
                  relative px-4 py-4 rounded-xl border-2 text-sm font-semibold text-center
                  transition-all duration-200 select-none
                  ${
                    isSelected
                      ? "bg-primary/10 border-primary text-primary shadow-sm"
                      : isDisabled
                        ? "bg-card/50 border-border/50 text-muted-foreground/50 cursor-not-allowed"
                        : "bg-card border-border text-foreground hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                  }
                `}
              >
                {isSelected && (
                  <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-primary" />
                )}
                {trait.name}
              </motion.button>
            );
          })}
        </div>

        {/* Submit */}
        <AnimatePresence>
          {selected.length === MAX && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
            >
              <Button
                data-ocid="trait.submit_button"
                onClick={handleSubmit}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              >
                See My Score
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Results Screen ────────────────────────────────────────────────────────────

function ResultsScreen({
  teamName,
  selectedTraits,
  totalScore,
  onViewLeaderboard,
}: {
  teamName: string;
  selectedTraits: string[];
  totalScore: number;
  onViewLeaderboard: () => void;
}) {
  const { mutate: submitEntry, isPending } = useSubmitEntry();

  // Submit exactly once on mount
  const submitted = useRef(false);
  useEffect(() => {
    if (submitted.current) return;
    submitted.current = true;
    submitEntry({ teamName, traits: selectedTraits, totalScore });
  }, [submitEntry, teamName, selectedTraits, totalScore]);

  const getScoreLabel = () => {
    if (totalScore >= 10)
      return { label: "Visionary Hero", color: "text-primary" };
    if (totalScore >= 4)
      return { label: "Confident Leader", color: "text-primary" };
    if (totalScore >= 0)
      return { label: "Average Leader", color: "text-muted-foreground" };
    return { label: "Struggling Leader", color: "text-destructive" };
  };

  const { label, color } = getScoreLabel();

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col items-center justify-center min-h-screen px-4 py-12"
    >
      <div className="w-full max-w-lg">
        {/* Step badge */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
            3
          </span>
          <span className="text-sm text-muted-foreground font-medium">
            Step 3 of 3 — Results
          </span>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm text-center">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.1,
            }}
            className="flex justify-center mb-4"
          >
            <div className="avatar-frame">
              <LeaderAvatar score={totalScore} />
            </div>
          </motion.div>

          {/* Score */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Leadership Score
            </p>
            <div className="text-6xl font-black text-foreground mb-1">
              {totalScore > 0 ? "+" : ""}
              {totalScore}
            </div>
            <p className={`text-base font-bold mb-1 ${color}`}>{label}</p>
            <p className="text-xl font-black text-foreground mb-6">
              {teamName}
            </p>
          </motion.div>

          {/* Traits list */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Your Traits
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {selectedTraits.map((trait) => (
                <span
                  key={trait}
                  className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full border border-primary/20"
                >
                  {trait}
                </span>
              ))}
            </div>
          </motion.div>

          <Button
            data-ocid="results.primary_button"
            onClick={onViewLeaderboard}
            disabled={isPending}
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                Saving score...
              </>
            ) : (
              <>
                <Trophy className="mr-2 w-5 h-5" />
                View Leaderboard
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Leaderboard Screen ────────────────────────────────────────────────────────

function LeaderboardScreen({ onPlayAgain }: { onPlayAgain: () => void }) {
  const queryClient = useQueryClient();
  const { data: entries = [], isLoading } = useGetLeaderboard();

  // Force a fresh fetch immediately when this screen mounts
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
  }, [queryClient]);

  const sorted = [...entries].sort(
    (a, b) => Number(b.totalScore) - Number(a.totalScore),
  );

  const rankMedal = (i: number) => {
    if (i === 0) return <span className="text-xl">🥇</span>;
    if (i === 1) return <span className="text-xl">🥈</span>;
    if (i === 2) return <span className="text-xl">🥉</span>;
    return (
      <span className="text-sm font-bold text-muted-foreground w-5 text-center">
        {i + 1}
      </span>
    );
  };

  return (
    <motion.div
      key="leaderboard"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col items-center min-h-screen px-4 py-12"
    >
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-2">
            Leaderboard
          </h2>
          <div className="flex items-center justify-center gap-2">
            <LiveIndicator />
            <span className="text-muted-foreground text-sm">
              updates every 2 seconds
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm mb-6">
          {isLoading ? (
            <div
              data-ocid="leaderboard.loading_state"
              className="p-8 text-center text-muted-foreground"
            >
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              Loading scores...
            </div>
          ) : sorted.length === 0 ? (
            <div
              data-ocid="leaderboard.empty_state"
              className="p-10 text-center text-muted-foreground"
            >
              <Crown className="w-10 h-10 mx-auto mb-3 text-border" />
              <p className="font-semibold">No teams yet</p>
              <p className="text-sm">Be the first to submit!</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {sorted.map((entry, i) => {
                const score = Number(entry.totalScore);
                return (
                  <motion.div
                    key={`${entry.teamName}-${i}`}
                    data-ocid={`leaderboard.row.${i + 1}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center px-5 py-4 gap-3 ${
                      i === 0 ? "bg-primary/5" : ""
                    }`}
                  >
                    {/* Medal + rank number */}
                    <div className="flex items-center gap-1.5 flex-shrink-0 min-w-[3rem]">
                      <div className="flex items-center justify-center w-5">
                        {rankMedal(i)}
                      </div>
                      {i < 3 && (
                        <span className="text-xs font-bold text-muted-foreground">
                          #{i + 1}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-bold text-base truncate ${i === 0 ? "text-primary" : "text-foreground"}`}
                      >
                        {entry.teamName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {entry.traits.slice(0, 3).join(", ")}
                        {entry.traits.length > 3 ? "…" : ""}
                      </p>
                    </div>
                    <div
                      className={`text-xl font-black flex-shrink-0 ${
                        score > 0
                          ? "text-primary"
                          : score < 0
                            ? "text-destructive"
                            : "text-muted-foreground"
                      }`}
                    >
                      {score > 0 ? "+" : ""}
                      {score}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            data-ocid="leaderboard.play_again_button"
            onClick={onPlayAgain}
            size="lg"
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 rounded-xl transition-all duration-200 hover:scale-[1.01]"
          >
            Play Again
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [step, setStep] = useState<Step>("start");
  const [teamName, setTeamName] = useState("");
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [totalScore, setTotalScore] = useState(0);

  // Check for host view mode
  const isHostView =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("host") === "true";

  // Shuffle once on mount, stable for the session
  const shuffledTraits = useMemo(() => shuffleArray(ALL_TRAITS), []);

  const handleStart = () => setStep("team");
  const handleTeamNext = (name: string) => {
    setTeamName(name);
    setStep("traits");
  };
  const handleTraitSubmit = (traits: string[], score: number) => {
    setSelectedTraits(traits);
    setTotalScore(score);
    setStep("results");
  };
  const handleViewLeaderboard = () => setStep("leaderboard");
  const handlePlayAgain = () => {
    setTeamName("");
    setSelectedTraits([]);
    setTotalScore(0);
    setStep("team");
  };

  // Host view — fullscreen leaderboard for projector
  if (isHostView) {
    return <HostView />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center px-6 py-4 bg-background/80 backdrop-blur-sm border-b border-gold/10">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-gold" />
          <span className="font-black text-sm tracking-widest uppercase text-gold hidden sm:block">
            Build the Best Leader
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-16">
        <AnimatePresence mode="wait">
          {step === "start" && (
            <StartScreen key="start" onStart={handleStart} />
          )}
          {step === "team" && <TeamScreen key="team" onNext={handleTeamNext} />}
          {step === "traits" && (
            <TraitScreen
              key="traits"
              shuffledTraits={shuffledTraits}
              onSubmit={handleTraitSubmit}
            />
          )}
          {step === "results" && (
            <ResultsScreen
              key="results"
              teamName={teamName}
              selectedTraits={selectedTraits}
              totalScore={totalScore}
              onViewLeaderboard={handleViewLeaderboard}
            />
          )}
          {step === "leaderboard" && (
            <LeaderboardScreen
              key="leaderboard"
              onPlayAgain={handlePlayAgain}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-gold/10">
        <p className="text-xs text-muted-foreground/60">
          © {new Date().getFullYear()}. Built with{" "}
          <span className="text-red-500/80">♥</span> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold/70 hover:text-gold transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
