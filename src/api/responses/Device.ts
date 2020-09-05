import { ProductType } from '../ProductType';
import { BatteryLevel } from '../BatteryLevel';

export default interface Device {
  id: number;
  NodeId: number;
  ProductType: ProductType;
  ProductIdentifier: string;
  ActiveFirmwareVersion: string;
  ModelIdentifier: string;
  DeviceLockEnabled: boolean;
  DisplayedSignalStrength: string;
  ReceptionOfController?: Reception;
  ReceptionOfDevice?: Reception;
  HardwareVersion?: string;
  SerialNumber?: string;
  ProductModel?: string;
  OtaImageQueryCount?: number;
  LastOtaImageQueryCount?: number;
  ParentNodeId?: number;
  BatteryVoltage?: number;
  BatteryLevel?: BatteryLevel;
  PendingZigbeeMessageMask?: number;
}

export interface Reception {
  Rssi: number;
  Lqi?: number;
}
