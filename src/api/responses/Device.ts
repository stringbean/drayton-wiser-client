export default interface Device {
  id: number;
  NodeId: number;
  ProductType: string;
  ProductIdentifier: string;
  ActiveFirmwareVersion: string;
  ModelIdentifier: string;
  DeviceLockEnabled: boolean;
  DisplayedSignalStrength: string;
  ReceptionOfController: Reception;
  ReceptionOfDevice: Reception;
  HardwareVersion: string;
  SerialNumber: string;
  ProductModel: string;
  OtaImageQueryCount?: number;
  LastOtaImageQueryCount?: number;
  ParentNodeId?: number;
  BatteryVoltage?: number;
  BatteryLevel: string;
  PendingZigbeeMessageMask?: number;
}

export interface Reception {
  Rssi: number;
  Lqi?: number;
}
