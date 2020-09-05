import SystemStatus from './SystemStatus';
import CloudSettings from './CloudSettings';
import HeatingChannel from './HeatingChannel';
import Room from './Room';
import Device from './Device';
import ZigbeeInfo from './ZigbeeInfo';
import UpgradeInfo from './UpgradeInfo';
import SmartValve from './SmartValve';
import RoomStat from './RoomStat';
import DeviceCapabilityMatrix from './DeviceCapabilityMatrix';
import Schedule from './Schedule';

export default interface FullStatus {
  System: SystemStatus;
  Cloud: CloudSettings;
  HeatingChannel: HeatingChannel[];
  Room: Room[];
  Device: Device[];
  Zigbee: ZigbeeInfo;
  UpgradeInfo: UpgradeInfo[];
  SmartValve: SmartValve[];
  RoomStat: RoomStat[];
  DeviceCapabilityMatrix: DeviceCapabilityMatrix;
  Schedule: Schedule[];
}
