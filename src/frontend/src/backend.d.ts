import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TeamEntry {
    teamName: string;
    traits: Array<string>;
    totalScore: bigint;
}
export interface backendInterface {
    getLeaderboard(): Promise<Array<TeamEntry>>;
    resetLeaderboard(): Promise<void>;
    submitEntry(teamName: string, traits: Array<string>, totalScore: bigint): Promise<void>;
}
