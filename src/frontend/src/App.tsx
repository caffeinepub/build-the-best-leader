import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import {
  AlertTriangle,
  ChevronRight,
  Crown,
  Loader2,
  RotateCcw,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  useGetLeaderboard,
  useResetLeaderboard,
  useSubmitEntry,
} from "./hooks/useQueries";

// ─── Types ────────────────────────────────────────────────────────────────────

type View = "start" | "team" | "traits" | "results" | "leaderboard";

interface Trait {
  name: string;
  score: number;
  type: "good" | "bad";
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GOOD_TRAITS: Trait[] = [
  { name: "Visionary", score: 5, type: "good" },
  { name: "Strategic Thinker", score: 4, type: "good" },
  { name: "Empathetic", score: 4, type: "good" },
  { name: "Good Listener", score: 3, type: "good" },
  { name: "Inspires Others", score: 3, type: "good" },
  { name: "Collaborative", score: 3, type: "good" },
  { name: "Ethical", score: 4, type: "good" },
  { name: "Resilient", score: 3, type: "good" },
];

const BAD_TRAITS: Trait[] = [
  { name: "Arrogant", score: -3, type: "bad" },
  { name: "Doesn't Listen", score: -4, type: "bad" },
  { name: "Needs Admiration", score: -3, type: "bad" },
  { name: "Manipulative", score: -3, type: "bad" },
  { name: "Impulsive", score: -2, type: "bad" },
  { name: "Overconfident", score: -3, type: "bad" },
  { name: "Rejects Feedback", score: -4, type: "bad" },
];

const ALL_TRAITS = [...GOOD_TRAITS, ...BAD_TRAITS];
const MAX_TRAITS = 5;

// ─── Avatar Logic ─────────────────────────────────────────────────────────────

function getAvatarData(score: number): { src: string; label: string } {
  if (score >= 15) {
    return {
      src: "/assets/generated/avatar-hero-transparent.dim_300x350.png",
      label: "Visionary Hero",
    };
  }
  if (score >= 5) {
    return {
      src: "/assets/generated/avatar-confident-transparent.dim_300x350.png",
      label: "Confident Leader",
    };
  }
  if (score >= 0) {
    return {
      src: "/assets/generated/avatar-neutral-transparent.dim_300x350.png",
      label: "Average Leader",
    };
  }
  return {
    src: "/assets/generated/avatar-villain-transparent.dim_300x350.png",
    label: "Struggling Leader",
  };
}

// ─── View Transition ──────────────────────────────────────────────────────────

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const pageTransition = {
  duration: 0.4,
  ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
};

// ─── Start Screen ─────────────────────────────────────────────────────────────

function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      key="start"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
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

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="flex gap-8 mb-10"
        >
          {[
            { label: "Traits", value: "15" },
            { label: "Max Score", value: "+29" },
            { label: "Categories", value: "2" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-black text-gold">{stat.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.75, type: "spring", stiffness: 150 }}
        >
          <Button
            size="lg"
            data-ocid="start.primary_button"
            onClick={onStart}
            className="gradient-gold text-background font-bold text-lg px-12 py-6 rounded-full hover:scale-105 transition-transform duration-200 shadow-gold"
          >
            Start Game
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Team Screen ──────────────────────────────────────────────────────────────

function TeamScreen({
  onContinue,
}: {
  onContinue: (teamName: string) => void;
}) {
  const [teamName, setTeamName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamName.trim().length < 1) return;
    onContinue(teamName.trim());
  };

  return (
    <motion.div
      key="team"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="flex flex-col items-center justify-center min-h-screen px-4"
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-16 h-16 rounded-full bg-surface-raised border-2 border-gold/30 flex items-center justify-center mx-auto mb-6"
          >
            <Users className="w-8 h-8 text-gold" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-black gold-text-gradient mb-3">
            Enter Your Team Name
          </h2>
          <p className="text-muted-foreground">
            Choose a name that represents your team's leadership style.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Input
              data-ocid="team.input"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. The Visionaries"
              maxLength={40}
              className="bg-surface-raised border-gold/30 focus:border-gold text-foreground placeholder:text-muted-foreground text-lg py-6 px-5 rounded-xl"
              autoFocus
            />
            {teamName.length > 0 && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {teamName.length}/40
              </div>
            )}
          </div>

          <Button
            type="submit"
            data-ocid="team.primary_button"
            disabled={teamName.trim().length < 1}
            className="w-full gradient-gold text-background font-bold text-base py-6 rounded-xl hover:scale-[1.02] transition-transform duration-200 shadow-gold disabled:opacity-40 disabled:scale-100"
          >
            Continue
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </form>
      </div>
    </motion.div>
  );
}

// ─── Trait Card ───────────────────────────────────────────────────────────────

function TraitCard({
  trait,
  isSelected,
  isDisabled,
  onToggle,
  index,
}: {
  trait: Trait;
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.button
      data-ocid={`traits.item.${index + 1}`}
      onClick={onToggle}
      disabled={isDisabled && !isSelected}
      whileHover={!isDisabled || isSelected ? { scale: 1.03 } : {}}
      whileTap={!isDisabled || isSelected ? { scale: 0.97 } : {}}
      className={[
        "relative w-full text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer outline-none",
        "flex items-center justify-between gap-3",
        isSelected
          ? "border-blue-500 bg-blue-500/10 shadow-md"
          : isDisabled && !isSelected
            ? "border-border/30 bg-surface/50 opacity-40 cursor-not-allowed"
            : "border-border/30 bg-surface-raised hover:border-blue-400 hover:bg-blue-400/5",
      ].join(" ")}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center bg-blue-500">
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            role="img"
            aria-label="Selected"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}

      <span
        className={`font-semibold text-sm md:text-base ${isDisabled && !isSelected ? "text-muted-foreground" : "text-foreground"}`}
      >
        {trait.name}
      </span>
    </motion.button>
  );
}

// ─── Traits Screen ────────────────────────────────────────────────────────────

function TraitsScreen({
  teamName,
  onSubmit,
  isSubmitting,
}: {
  teamName: string;
  onSubmit: (traits: string[], score: number) => void;
  isSubmitting: boolean;
}) {
  const [selectedTraits, setSelectedTraits] = useState<Set<string>>(new Set());

  const shuffledTraits = useMemo(() => {
    const arr = [...ALL_TRAITS];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  const selectedCount = selectedTraits.size;
  const currentScore = Array.from(selectedTraits).reduce((sum, name) => {
    const trait = ALL_TRAITS.find((t) => t.name === name);
    return sum + (trait?.score ?? 0);
  }, 0);

  const toggleTrait = useCallback((name: string) => {
    setSelectedTraits((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else if (next.size < MAX_TRAITS) {
        next.add(name);
      }
      return next;
    });
  }, []);

  const handleSubmit = () => {
    if (selectedCount !== MAX_TRAITS) return;
    onSubmit(Array.from(selectedTraits), currentScore);
  };

  const isComplete = selectedCount === MAX_TRAITS;

  return (
    <motion.div
      key="traits"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="min-h-screen px-4 py-8"
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-black gold-text-gradient mb-1">
            Select 5 Leadership Traits
          </h2>
          <p className="text-muted-foreground text-sm">
            Team: <span className="text-gold font-semibold">{teamName}</span>
          </p>
        </div>

        {/* Score & progress bar */}
        <div className="sticky top-4 z-10 mb-6">
          <div className="bg-surface-raised border border-gold/20 rounded-2xl px-5 py-4 flex items-center justify-between backdrop-blur-sm shadow-gold-sm">
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground font-medium">
                {selectedCount}/{MAX_TRAITS} selected
              </div>
              {/* Mini dots */}
              <div className="flex gap-1">
                {["slot1", "slot2", "slot3", "slot4", "slot5"].map(
                  (slot, i) => (
                    <div
                      key={slot}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        i < selectedCount ? "bg-gold scale-110" : "bg-border/50"
                      }`}
                    />
                  ),
                )}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-xs text-muted-foreground uppercase tracking-widest">
                Score
              </div>
              <div
                className={`text-2xl font-black transition-colors duration-300 ${
                  currentScore > 0
                    ? "text-good-trait"
                    : currentScore < 0
                      ? "text-bad-trait"
                      : "text-gold"
                }`}
              >
                {currentScore > 0 ? `+${currentScore}` : currentScore}
              </div>
            </div>
          </div>
        </div>

        {/* All Traits (shuffled) */}
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {shuffledTraits.map((trait, i) => (
              <TraitCard
                key={trait.name}
                trait={trait}
                index={i}
                isSelected={selectedTraits.has(trait.name)}
                isDisabled={
                  !selectedTraits.has(trait.name) && selectedCount >= MAX_TRAITS
                }
                onToggle={() => toggleTrait(trait.name)}
              />
            ))}
          </div>
        </div>

        {/* Submit */}
        <Button
          data-ocid="traits.submit_button"
          onClick={handleSubmit}
          disabled={!isComplete || isSubmitting}
          className="w-full gradient-gold text-background font-bold text-base py-6 rounded-xl hover:scale-[1.02] transition-transform duration-200 shadow-gold disabled:opacity-40 disabled:scale-100"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Star className="mr-2 w-4 h-4" />
              See My Leader
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Results Screen ───────────────────────────────────────────────────────────

function ResultsScreen({
  teamName,
  selectedTraits,
  totalScore,
  onViewLeaderboard,
  onPlayAgain,
}: {
  teamName: string;
  selectedTraits: string[];
  totalScore: number;
  onViewLeaderboard: () => void;
  onPlayAgain: () => void;
}) {
  const avatar = getAvatarData(totalScore);
  const traitObjects = selectedTraits.map(
    (name) => ALL_TRAITS.find((t) => t.name === name)!,
  );

  return (
    <motion.div
      key="results"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="min-h-screen px-4 py-10"
    >
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-black gold-text-gradient mb-1">
            Your Leader Profile
          </h2>
          <p className="text-muted-foreground">
            Team: <span className="text-gold font-semibold">{teamName}</span>
          </p>
        </div>

        {/* Avatar */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 120,
            damping: 14,
          }}
          className="flex flex-col items-center mb-8"
        >
          <div className="relative mb-4">
            {/* Gold ring */}
            <div className="absolute inset-[-8px] rounded-full border-2 border-gold/30 animate-pulse-gold" />
            <div className="absolute inset-[-16px] rounded-full border border-gold/10" />
            <div className="w-48 h-56 relative z-10">
              <img
                src={avatar.src}
                alt={avatar.label}
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>
          <Badge className="bg-surface-raised border border-gold/40 text-gold font-bold text-sm px-4 py-1.5">
            {avatar.label}
          </Badge>
        </motion.div>

        {/* Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-surface-raised border border-gold/20 rounded-2xl p-6 mb-6 text-center"
        >
          <div className="text-sm uppercase tracking-widest text-muted-foreground mb-2">
            Total Leadership Score
          </div>
          <div
            className={`text-6xl font-black ${
              totalScore > 0
                ? "text-good-trait"
                : totalScore < 0
                  ? "text-bad-trait"
                  : "text-gold"
            }`}
          >
            {totalScore > 0 ? `+${totalScore}` : totalScore}
          </div>
        </motion.div>

        {/* Traits list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-surface-raised border border-gold/20 rounded-2xl p-5 mb-8"
        >
          <div className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
            Selected Traits
          </div>
          <div className="space-y-2">
            {traitObjects.map((trait) => (
              <div
                key={trait.name}
                className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
              >
                <span className="font-medium text-foreground">
                  {trait.name}
                </span>
                <span
                  className={`font-black text-base ${
                    trait.type === "good" ? "text-good-trait" : "text-bad-trait"
                  }`}
                >
                  {trait.score > 0 ? `+${trait.score}` : trait.score}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Button
            data-ocid="results.primary_button"
            onClick={onViewLeaderboard}
            className="flex-1 gradient-gold text-background font-bold py-5 rounded-xl hover:scale-[1.02] transition-transform duration-200 shadow-gold"
          >
            <Trophy className="mr-2 w-4 h-4" />
            View Leaderboard
          </Button>
          <Button
            data-ocid="results.secondary_button"
            onClick={onPlayAgain}
            variant="outline"
            className="flex-1 border-gold/40 text-gold hover:bg-gold/10 hover:border-gold font-bold py-5 rounded-xl transition-all duration-200"
          >
            <RotateCcw className="mr-2 w-4 h-4" />
            Play Again
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Leaderboard Screen ───────────────────────────────────────────────────────

const CROWN_COLORS = ["text-gold", "text-blue-400", "text-orange-500"];
const CROWN_LABELS = ["1st", "2nd", "3rd"];

function LeaderboardScreen({ onPlayAgain }: { onPlayAgain: () => void }) {
  const { data: entries = [], isLoading, isError } = useGetLeaderboard();
  const resetMutation = useResetLeaderboard();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const sorted = [...entries].sort(
    (a, b) => Number(b.totalScore) - Number(a.totalScore),
  );

  const handleReset = async () => {
    try {
      await resetMutation.mutateAsync();
      setResetDialogOpen(false);
      toast.success("Leaderboard has been reset.");
    } catch {
      toast.error("Failed to reset leaderboard.");
    }
  };

  return (
    <motion.div
      key="leaderboard"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="min-h-screen px-4 py-10"
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="w-16 h-16 rounded-full bg-surface-raised border-2 border-gold/30 flex items-center justify-center mx-auto mb-5 animate-pulse-gold"
          >
            <Trophy className="w-8 h-8 text-gold" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-black gold-text-gradient mb-1">
            Leadership Leaderboard
          </h2>
          <p className="text-muted-foreground text-sm">
            Auto-refreshes every 5 seconds
          </p>
        </div>

        {/* Leaderboard list */}
        <div data-ocid="leaderboard.list" className="space-y-3 mb-8">
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <AlertTriangle className="w-8 h-8 text-destructive" />
              <p className="text-muted-foreground">
                Failed to load leaderboard
              </p>
            </div>
          )}

          {!isLoading && !isError && sorted.length === 0 && (
            <div className="text-center py-16 border border-dashed border-gold/20 rounded-2xl">
              <Crown className="w-12 h-12 text-gold/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg font-medium">
                No teams yet
              </p>
              <p className="text-muted-foreground/60 text-sm mt-1">
                Be the first to submit your leader!
              </p>
            </div>
          )}

          {!isLoading &&
            sorted.map((entry, i) => {
              const rank = i + 1;
              const score = Number(entry.totalScore);
              const isTopThree = rank <= 3;
              const ocid = rank <= 3 ? `leaderboard.item.${rank}` : undefined;

              return (
                <motion.div
                  key={`${entry.teamName}-${i}`}
                  data-ocid={ocid}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={[
                    "flex items-start gap-4 p-4 rounded-2xl border-2 transition-all duration-200",
                    rank === 1
                      ? "border-gold/60 bg-gold/5 shadow-gold-sm"
                      : rank === 2
                        ? "border-blue-300/40 bg-blue-200/20"
                        : rank === 3
                          ? "border-orange-300/40 bg-orange-200/20"
                          : "border-border/30 bg-surface-raised",
                  ].join(" ")}
                >
                  {/* Rank */}
                  <div className="flex flex-col items-center justify-center w-10 shrink-0">
                    {isTopThree ? (
                      <Crown className={`w-7 h-7 ${CROWN_COLORS[rank - 1]}`} />
                    ) : (
                      <span className="text-lg font-black text-muted-foreground">
                        {rank}
                      </span>
                    )}
                    {isTopThree && (
                      <span
                        className={`text-[10px] font-bold ${CROWN_COLORS[rank - 1]}`}
                      >
                        {CROWN_LABELS[rank - 1]}
                      </span>
                    )}
                  </div>

                  {/* Team info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-base text-foreground mb-2 truncate">
                      {entry.teamName}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {entry.traits.map((traitName) => {
                        const trait = ALL_TRAITS.find(
                          (t) => t.name === traitName,
                        );
                        const isGood = trait?.type === "good";
                        return (
                          <span
                            key={traitName}
                            className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                              isGood
                                ? "border-good-trait/40 text-good-trait bg-good-trait/10"
                                : "border-bad-trait/40 text-bad-trait bg-bad-trait/10"
                            }`}
                          >
                            {traitName}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Score */}
                  <div className="shrink-0 text-right">
                    <div
                      className={`text-2xl font-black ${
                        score > 0
                          ? "text-good-trait"
                          : score < 0
                            ? "text-bad-trait"
                            : "text-gold"
                      }`}
                    >
                      {score > 0 ? `+${score}` : score}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      pts
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            data-ocid="leaderboard.primary_button"
            onClick={onPlayAgain}
            className="flex-1 gradient-gold text-background font-bold py-5 rounded-xl hover:scale-[1.02] transition-transform duration-200 shadow-gold"
          >
            <RotateCcw className="mr-2 w-4 h-4" />
            Play Again
          </Button>

          <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                data-ocid="leaderboard.delete_button"
                variant="outline"
                className="flex-1 border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive font-bold py-5 rounded-xl transition-all duration-200"
              >
                <RotateCcw className="mr-2 w-4 h-4" />
                Reset Game
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-surface-raised border-gold/20 max-w-sm">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-foreground">
                  Reset the leaderboard?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  This will permanently delete all team entries. This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <Button
                  data-ocid="leaderboard.cancel_button"
                  variant="outline"
                  onClick={() => setResetDialogOpen(false)}
                  className="border-gold/30 text-foreground hover:bg-surface-elevated"
                >
                  Cancel
                </Button>
                <Button
                  data-ocid="leaderboard.confirm_button"
                  onClick={handleReset}
                  disabled={resetMutation.isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {resetMutation.isPending ? (
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  ) : null}
                  Reset
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </motion.div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState<View>("start");
  const [teamName, setTeamName] = useState("");
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [totalScore, setTotalScore] = useState(0);

  const submitMutation = useSubmitEntry();

  const handleStart = () => setView("team");

  const handleTeamContinue = (name: string) => {
    setTeamName(name);
    setView("traits");
  };

  const handleTraitsSubmit = async (traits: string[], score: number) => {
    try {
      await submitMutation.mutateAsync({ teamName, traits, totalScore: score });
      setSelectedTraits(traits);
      setTotalScore(score);
      setView("results");
    } catch {
      toast.error("Failed to submit your entry. Please try again.");
    }
  };

  const handleViewLeaderboard = () => setView("leaderboard");

  const handlePlayAgain = () => {
    setTeamName("");
    setSelectedTraits([]);
    setTotalScore(0);
    setView("team");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-sm border-b border-gold/10">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-gold" />
          <span className="font-black text-sm tracking-widest uppercase text-gold hidden sm:block">
            Build the Best Leader
          </span>
        </div>
        {view !== "start" && view !== "leaderboard" && (
          <button
            type="button"
            data-ocid="nav.leaderboard_button"
            onClick={() => setView("leaderboard")}
            className="text-xs text-muted-foreground hover:text-gold transition-colors flex items-center gap-1.5 font-medium"
          >
            <Trophy className="w-3.5 h-3.5" />
            Leaderboard
          </button>
        )}
      </header>

      {/* Main content with top padding for fixed header */}
      <main className="pt-16">
        <AnimatePresence mode="wait">
          {view === "start" && (
            <StartScreen key="start" onStart={handleStart} />
          )}
          {view === "team" && (
            <TeamScreen key="team" onContinue={handleTeamContinue} />
          )}
          {view === "traits" && (
            <TraitsScreen
              key="traits"
              teamName={teamName}
              onSubmit={handleTraitsSubmit}
              isSubmitting={submitMutation.isPending}
            />
          )}
          {view === "results" && (
            <ResultsScreen
              key="results"
              teamName={teamName}
              selectedTraits={selectedTraits}
              totalScore={totalScore}
              onViewLeaderboard={handleViewLeaderboard}
              onPlayAgain={handlePlayAgain}
            />
          )}
          {view === "leaderboard" && (
            <LeaderboardScreen
              key="leaderboard"
              onPlayAgain={handlePlayAgain}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-gold/10 mt-10">
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

      <Toaster theme="light" />
    </div>
  );
}
