import SystemStatus from './SystemStatus';
import CloudSettings from './CloudSettings';
import ZigbeeInfo from './ZigbeeInfo';
import DeviceCapabilities from './DeviceCapabilities';
import Room from './Room';
import HeatingChannel from './HeatingChannel';
import Device from './Device';
import UpgradeInfo from './UpgradeInfo';
import SmartValve from './SmartValve';
import RoomStat from './RoomStat';
import Schedule from './Schedule';

export default interface DomainStatus {
  System: SystemStatus;
  Cloud: CloudSettings;
  HeatingChannel: HeatingChannel[];
  Room: Room[];
  Device: Device[];
  Zigbee: ZigbeeInfo;
  UpgradeInfo: UpgradeInfo[];
  SmartValve: SmartValve[];
  RoomStat: RoomStat[];
  DeviceCapabilityMatrix: DeviceCapabilities;
  Schedule: Schedule[];
}
