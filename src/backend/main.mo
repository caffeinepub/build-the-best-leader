import Array "mo:core/Array";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Migration "migration";

(with migration = Migration.run)
actor {
  type TeamEntry = {
    teamName : Text;
    traits : [Text];
    totalScore : Int;
  };

  module TeamEntry {
    public func compareByScoreDescending(a : TeamEntry, b : TeamEntry) : Order.Order {
      switch (Int.compare(a.totalScore, b.totalScore)) {
        case (#equal) { Text.compare(a.teamName, b.teamName) };
        case (other) {
          switch (other) {
            case (#greater) { #less };
            case (#less) { #greater };
            case (#equal) { #equal };
          };
        };
      };
    };
  };

  let entries = Map.empty<Text, TeamEntry>();

  public shared ({ caller }) func submitEntry(teamName : Text, traits : [Text], totalScore : Int) : async () {
    let entry : TeamEntry = {
      teamName;
      traits;
      totalScore;
    };
    entries.add(teamName, entry);
  };

  public query ({ caller }) func getLeaderboard() : async [TeamEntry] {
    entries.values().toArray().sort(TeamEntry.compareByScoreDescending);
  };

  public shared ({ caller }) func resetLeaderboard() : async () {
    entries.clear();
  };
};
