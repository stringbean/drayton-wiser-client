export default interface SmartValve {
  id: number;
  MountingOrientation: string;
  SetPoint: number;
  MeasuredTemperature: number;
  PercentageDemand: number;
  WindowState: string;
  ExternalRoomStatTemperature: number;
}
