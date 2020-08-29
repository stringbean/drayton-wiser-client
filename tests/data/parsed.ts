import { Device, Room } from '../../src';

import * as unparsed from './unparsed';

export const ValidRoom = new Room(unparsed.AutoRoom);
export const InvalidRoom = new Room(unparsed.InvalidRoom);
export const ControllerDevice = new Device(unparsed.ControllerDevice);
export const ThermostatDevice = new Device(unparsed.ThermostatDevice);
export const RoomThermostatDevice = new Device(unparsed.RoomThermostatDevice);
