import Map "mo:core/Map";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Text "mo:core/Text";

module {
  type TeamEntry = {
    teamName : Text;
    traits : [Text];
    totalScore : Int;
  };

  type OldActor = {
    entries : Map.Map<Text, TeamEntry>;
  };

  type NewActor = {
    var entriesArray : [TeamEntry];
  };

  public func run(old : OldActor) : NewActor {
    { var entriesArray = old.entries.values().toArray() };
  };
};
