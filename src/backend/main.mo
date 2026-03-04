import Array "mo:core/Array";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";

actor {
  type TeamEntry = {
    teamName : Text;
    traits : [Text];
    totalScore : Nat;
  };

  module TeamEntry {
    public func compareByScoreDescending(a : TeamEntry, b : TeamEntry) : Order.Order {
      if (a.totalScore > b.totalScore) {
        #less;
      } else if (a.totalScore < b.totalScore) {
        #greater;
      } else {
        Text.compare(a.teamName, b.teamName);
      };
    };
  };

  let entries = Map.empty<Text, TeamEntry>();

  public shared ({ caller }) func submitEntry(teamName : Text, traits : [Text], totalScore : Nat) : async () {
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
