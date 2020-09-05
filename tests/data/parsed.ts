import { Device, Room } from '../../src';

import * as unparsed from './unparsed';
import { SystemStatus } from '../../src/SystemStatus';

export const NormalSystemStatus = new SystemStatus(unparsed.NormalSystemStatus);
export const AwaySystemStatus = new SystemStatus(unparsed.AwaySystemStatus);
export const BoostedSystemStatus = new SystemStatus(
  unparsed.BoostedSystemStatus,
);
export const ValidRoom = new Room(unparsed.AutoRoom);
export const InvalidRoom = new Room(unparsed.InvalidRoom);
export const ControllerDevice = new Device(unparsed.ControllerDevice);
export const ThermostatDevice = new Device(unparsed.ThermostatDevice);
export const RoomThermostatDevice = new Device(unparsed.RoomThermostatDevice);
