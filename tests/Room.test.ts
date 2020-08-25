import Room from '../src/Room';
import { expect, test } from '@jest/globals';
import { ControlType, HeatingType } from '../src/constants';
import { ValidRoom, InvalidRoom } from './data/unparsed';

test("new Room() parses 'invalid' room", () => {
  const room = new Room(InvalidRoom);

  expect(room.id).toBe(5);
  expect(room.name).toBe('Office');
  expect(room.isValid).toBeFalsy();
  expect(room.heatingType).toBe(HeatingType.HydronicRadiator);
  expect(room.controlType).toBe(ControlType.HeatingOnly);
});

test("new Room() parses 'valid' room", () => {
  const room = new Room(ValidRoom);

  expect(room.id).toBe(6);
  expect(room.name).toBe('Bathroom');
  expect(room.isValid).toBeTruthy();
  expect(room.heatingType).toBe(HeatingType.HydronicRadiator);
  expect(room.controlType).toBe(ControlType.HeatingOnly);
});
