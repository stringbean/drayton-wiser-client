import { SystemStatus } from '../src';
import { expect, test } from '@jest/globals';
import {
  AwaySystemStatus,
  BoostedSystemStatus,
  NormalSystemStatus,
} from './data/unparsed';

test("new SystemStatus() parses 'normal' status", () => {
  const status = new SystemStatus(NormalSystemStatus);

  expect(status.version).toEqual('2.54.0-2401648bc2');
  expect(status.ecoMode).toBeTruthy();
  expect(status.awayMode).toBeFalsy();
  expect(status.awayModeSetPoint).toEqual(12);
  expect(status.heatingOverrideEnabled).toBeFalsy();
  expect(status.overridesActive).toBeFalsy();
});

test("new SystemStatus() parses 'away' status", () => {
  const status = new SystemStatus(AwaySystemStatus);

  expect(status.version).toEqual('2.54.0-2401648bc2');
  expect(status.ecoMode).toBeTruthy();
  expect(status.awayMode).toBeTruthy();
  expect(status.awayModeSetPoint).toEqual(12);
  expect(status.heatingOverrideEnabled).toBeFalsy();
  expect(status.overridesActive).toBeFalsy();
});

test("new SystemStatus() parses 'boosted' status", () => {
  const status = new SystemStatus(BoostedSystemStatus);

  expect(status.version).toEqual('2.54.0-2401648bc2');
  expect(status.ecoMode).toBeTruthy();
  expect(status.awayMode).toBeFalsy();
  expect(status.awayModeSetPoint).toEqual(12);
  expect(status.heatingOverrideEnabled).toBeFalsy();
  expect(status.overridesActive).toBeTruthy();
});
