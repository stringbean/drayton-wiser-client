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

  expect(room.id).toBe(5);
  expect(room.name).toBe('Office');
  expect(room.isValid).toBeFalsy();
  expect(room.heatingType).toBe(HeatingType.HydronicRadiator);
  expect(room.controlType).toBe(ControlType.HeatingOnly);
  expect(room.mode).toBe(RoomMode.Unknown);
  expect(room.setTemperature).toBeUndefined();
  expect(room.temperature).toBeUndefined();
});

test("new Room() parses 'auto' room", () => {
  const room = new Room(AutoRoom);

  expect(room.id).toBe(6);
  expect(room.name).toBe('Bathroom');
  expect(room.isValid).toBeTruthy();
  expect(room.heatingType).toBe(HeatingType.HydronicRadiator);
  expect(room.controlType).toBe(ControlType.HeatingOnly);
  expect(room.mode).toBe(RoomMode.Auto);
  expect(room.setTemperature).toBe(18);
  expect(room.temperature).toBe(23.3);
});

test("new Room() parses 'off' room", () => {
  const room = new Room(OffRoom);

  expect(room.id).toBe(1);
  expect(room.name).toBe('Hall');
  expect(room.isValid).toBeTruthy();
  expect(room.heatingType).toBe(HeatingType.HydronicRadiator);
  expect(room.controlType).toBe(ControlType.HeatingOnly);
  expect(room.mode).toBe(RoomMode.Off);
  expect(room.setTemperature).toBeUndefined();
  expect(room.temperature).toBe(20.9);
});

test("new Room() parses 'boosted' room", () => {
  const room = new Room(BoostRoom);

  expect(room.id).toBe(7);
  expect(room.name).toBe('Kitchen');
  expect(room.isValid).toBeTruthy();
  expect(room.heatingType).toBe(HeatingType.HydronicRadiator);
  expect(room.controlType).toBe(ControlType.HeatingOnly);
  expect(room.mode).toBe(RoomMode.Boost);
  expect(room.setTemperature).toBe(22);
  expect(room.temperature).toBe(20.2);
});

test("new Room() parses 'away' room", () => {
  const room = new Room(AwayRoom);

  expect(room.id).toBe(1);
  expect(room.name).toBe('Hall');
  expect(room.isValid).toBeTruthy();
  expect(room.heatingType).toBe(HeatingType.HydronicRadiator);
  expect(room.controlType).toBe(ControlType.HeatingOnly);
  expect(room.mode).toBe(RoomMode.Away);
  expect(room.setTemperature).toBe(12);
  expect(room.temperature).toBe(20.9);
});

test("new Room() parses 'off away' room", () => {
  const room = new Room(OffAwayRoom);

  expect(room.id).toBe(1);
  expect(room.name).toBe('Hall');
  expect(room.isValid).toBeTruthy();
  expect(room.heatingType).toBe(HeatingType.HydronicRadiator);
  expect(room.controlType).toBe(ControlType.HeatingOnly);
  expect(room.mode).toBe(RoomMode.Off);
  expect(room.setTemperature).toBeUndefined();
  expect(room.temperature).toBe(20.9);
});

test("new Room() parses 'manual' room", () => {
  const room = new Room(ManualRoom);

  expect(room.id).toBe(6);
  expect(room.name).toBe('Bathroom');
  expect(room.isValid).toBeTruthy();
  expect(room.heatingType).toBe(HeatingType.HydronicRadiator);
  expect(room.controlType).toBe(ControlType.HeatingOnly);
  expect(room.mode).toBe(RoomMode.Manual);
  expect(room.setTemperature).toBe(23);
  expect(room.temperature).toBe(21.1);
});
