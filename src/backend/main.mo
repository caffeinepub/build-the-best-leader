import Array "mo:core/Array";
import Int "mo:core/Int";
import Migration "migration";
import Order "mo:core/Order";
import Text "mo:core/Text";

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
        case (order) {
          switch (order) {
            case (#greater) { #less };
            case (#less) { #greater };
            case (#equal) { #equal };
          };
        };
      };
    };
  };

  var entriesArray : [TeamEntry] = [];

  public shared ({ caller }) func submitEntry(teamName : Text, traits : [Text], totalScore : Int) : async () {
    let filteredArray = entriesArray.filter(
      func(entry) { entry.teamName != teamName }
    );
    let newEntry : TeamEntry = { teamName; traits; totalScore };
    entriesArray := filteredArray.concat([newEntry]);
  };

  public query ({ caller }) func getLeaderboard() : async [TeamEntry] {
    entriesArray.sort(TeamEntry.compareByScoreDescending);
  };

  public shared ({ caller }) func resetLeaderboard() : async () {
    entriesArray := [];
  };
};
