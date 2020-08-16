import Room from '../src/Room';
import { expect, test } from '@jest/globals';
import { ControlType, HeatingType } from '../src/constants';

test("new Room() parses 'invalid' room", () => {
  const room = new Room({
    id: 5,
    ScheduleId: 5,
    ComfortModeScore: 999,
    HeatingRate: 865,
    SmartValveIds: [],
    Name: 'Office',
    Mode: 'Auto',
    WindowDetectionActive: false,
    ControlSequenceOfOperation: ControlType.HeatingOnly,
    HeatingType: HeatingType.HydronicRadiator,
    CalculatedTemperature: -32768,
    CurrentSetPoint: 160,
    SetpointOrigin: 'FromSchedule',
    DisplayedSetPoint: 160,
    ScheduledSetPoint: 160,
    Invalid: 'NothingAssigned',
    ComfortTarget: 210,
    EffectiveMode: 'Auto',
  });

  expect(room.id).toBe(5);
  expect(room.name).toBe('Office');
  expect(room.isValid).toBeFalsy();
  expect(room.heatingType).toBe(HeatingType.HydronicRadiator);
  expect(room.controlType).toBe(ControlType.HeatingOnly);
});

test("new Room() parses 'valid' room", () => {
  const room = new Room({
    id: 6,
    ScheduleId: 6,
    ComfortModeScore: 1378,
    HeatingRate: 2983,
    SmartValveIds: [2],
    Name: 'Bathroom',
    Mode: 'Auto',
    DemandType: 'Modulating',
    WindowDetectionActive: false,
    ControlSequenceOfOperation: ControlType.HeatingOnly,
    HeatingType: HeatingType.HydronicRadiator,
    CalculatedTemperature: 233,
    CurrentSetPoint: 180,
    PercentageDemand: 0,
    ControlOutputState: 'Off',
    WindowState: 'Closed',
    SetpointOrigin: 'FromSchedule',
    DisplayedSetPoint: 180,
    ScheduledSetPoint: 180,
    RoundedAlexaTemperature: 235,
    EffectiveMode: 'Auto',
    PercentageDemandForItrv: 0,
  });

  expect(room.id).toBe(6);
  expect(room.name).toBe('Bathroom');
  expect(room.isValid).toBeTruthy();
  expect(room.heatingType).toBe(HeatingType.HydronicRadiator);
  expect(room.controlType).toBe(ControlType.HeatingOnly);
});
