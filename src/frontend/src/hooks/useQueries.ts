import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TeamEntry } from "../backend.d.ts";
import { useActor } from "./useActor";

export function useGetLeaderboard() {
  const { actor } = useActor();
  return useQuery<TeamEntry[]>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard();
    },
    enabled: !!actor,
    refetchInterval: 2000,
    staleTime: 0,
    gcTime: 60000,
  });
}

export function useSubmitEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      teamName,
      traits,
      totalScore,
    }: {
      teamName: string;
      traits: string[];
      totalScore: number;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.submitEntry(teamName, traits, BigInt(totalScore));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}

export function useResetLeaderboard() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      await actor.resetLeaderboard();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}
