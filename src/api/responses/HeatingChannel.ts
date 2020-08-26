export default interface HeatingChannel {
  id: number;
  Name: string;
  RoomIds: number[];
  PercentageDemand: number;
  DemandOnOffOutput: string;
  HeatingRelayState: string;
  IsSmartValvePreventingDemand: boolean;
}
