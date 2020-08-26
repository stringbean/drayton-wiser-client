import { Room } from '../src';
import { expect, test } from '@jest/globals';
import { ValidRoom, InvalidRoom } from './data/unparsed';
import { HeatingType } from '../src/HeatingType';
import { ControlType } from '../src/ControlType';

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
