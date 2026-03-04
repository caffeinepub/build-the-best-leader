import Map "mo:core/Map";
import Text "mo:core/Text";

module {
  type OldTeamEntry = {
    teamName : Text;
    traits : [Text];
    totalScore : Nat;
  };

  type OldActor = {
    entries : Map.Map<Text, OldTeamEntry>;
  };

  type NewTeamEntry = {
    teamName : Text;
    traits : [Text];
    totalScore : Int;
  };

  type NewActor = {
    entries : Map.Map<Text, NewTeamEntry>;
  };

  public func run(old : OldActor) : NewActor {
    let newEntries = old.entries.map<Text, OldTeamEntry, NewTeamEntry>(
      func(_k, oldEntry) {
        { oldEntry with totalScore = oldEntry.totalScore.toInt() };
      }
    );
    { entries = newEntries };
  };
};
