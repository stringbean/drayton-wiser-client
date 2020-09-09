import { Room } from '../src';
import { expect, test } from '@jest/globals';
import {
  AutoRoom,
  AwayRoom,
  BoostRoom,
  InvalidRoom,
  ManualRoom,
  OffAwayRoom,
  OffRoom,
} from './data/unparsed';
import { HeatingType } from '../src/api/HeatingType';
import { ControlType } from '../src/api/ControlType';
import { RoomMode } from '../src';

test("new Room() parses 'invalid' room", () => {
  const room = new Room(InvalidRoom);

  expect(room.id).toBe(3);
  expect(room.name).toBe('Bedroom');
  expect(room.isValid).toBeFalsy();
  expect(room.heatingType).toBe(HeatingType.HydronicRadiator);
  expect(room.controlType).toBe(ControlType.HeatingOnly);
  expect(room.mode).toBe(RoomMode.Unknown);
  expect(room.setTemperature).toBeUndefined();
  expect(room.temperature).toBeUndefined();
  expect(room.roomStatId).toBeUndefined();
  expect(room.thermostatIds).toHaveLength(0);
});

test("new Room() parses 'auto' room", () => {
  const room = new Room(AutoRoom);

  expect(room.id).toBe(1);
  expect(room.name).toBe('Hall');
  expect(room.isValid).toBeTruthy();
  expect(room.heatingType).toBe(HeatingType.HydronicRadiator);
  expect(room.controlType).toBe(ControlType.HeatingOnly);
  expect(room.mode).toBe(RoomMode.Auto);
  expect(room.setTemperature).toBe(18);
  expect(room.temperature).toBe(20.3);
  expect(room.roomStatId).toBe(5);
  expect(room.thermostatIds).toEqual([1]);
});

test("new Room() parses 'off' room", () => {
  const room = new Room(OffRoom);

  expect(room.id).toBe(1);
  expect(room.name).toBe('Hall');
  expect(room.mode).toBe(RoomMode.Off);
  expect(room.setTemperature).toBeUndefined();
  expect(room.temperature).toBe(20.3);
  expect(room.roomStatId).toBeUndefined();
  expect(room.thermostatIds).toEqual([10]);
});

test("new Room() parses 'boosted' room", () => {
  const room = new Room(BoostRoom);

  expect(room.id).toBe(1);
  expect(room.mode).toBe(RoomMode.Boost);
  expect(room.setTemperature).toBe(22.5);
  expect(room.temperature).toBe(20.3);
  expect(room.roomStatId).toBe(5);
  expect(room.thermostatIds).toHaveLength(0);
});

test("new Room() parses 'away' room", () => {
  const room = new Room(AwayRoom);

  expect(room.id).toBe(1);
  expect(room.mode).toBe(RoomMode.Away);
  expect(room.setTemperature).toBe(12);
  expect(room.temperature).toBe(20.3);
});

test("new Room() parses 'off away' room", () => {
  const room = new Room(OffAwayRoom);

  expect(room.id).toBe(1);
  expect(room.mode).toBe(RoomMode.Off);
  expect(room.setTemperature).toBeUndefined();
  expect(room.temperature).toBe(20.3);
});

test("new Room() parses 'manual' room", () => {
  const room = new Room(ManualRoom);

  expect(room.id).toBe(1);
  expect(room.mode).toBe(RoomMode.Manual);
  expect(room.setTemperature).toBe(15);
  expect(room.temperature).toBe(20.3);
});
