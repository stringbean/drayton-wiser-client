import * as system_normal from './system/normal.json';
import * as system_away from './system/away.json';
import * as system_boosted from './system/boosted.json';

import * as room_auto from './rooms/auto.json';
import * as room_off from './rooms/off.json';
import * as room_invalid from './rooms/invalid.json';
import * as room_manual from './rooms/manual.json';
import * as room_boost from './rooms/boost.json';
import * as room_away from './rooms/away.json';
import * as room_off_away from './rooms/away_off.json';

import * as device_controller from './devices/controller.json';
import * as device_thermostat from './devices/thermostat.json';
import * as device_roomstat from './devices/roomstat.json';

import * as full_status from './full-status.json';

import Device from '../../src/api/responses/Device';
import Room from '../../src/api/responses/Room';
import SystemStatus from '../../src/api/responses/SystemStatus';
import FullStatus from '../../src/api/responses/FullStatus';

export const NormalSystemStatus = <SystemStatus>system_normal;
export const AwaySystemStatus = <SystemStatus>system_away;
export const BoostedSystemStatus = <SystemStatus>system_boosted;

export const AutoRoom = <Room>room_auto;
export const OffRoom = <Room>room_off;
export const BoostRoom = <Room>room_boost;
export const AwayRoom = <Room>room_away;
export const OffAwayRoom = <Room>room_off_away;
export const ManualRoom = <Room>room_manual;
export const InvalidRoom = <Room>room_invalid;

export const ControllerDevice = <Device>device_controller;
export const ThermostatDevice = <Device>device_thermostat;
export const RoomThermostatDevice = <Device>device_roomstat;

export const FullSystemStatus = <FullStatus>full_status;
