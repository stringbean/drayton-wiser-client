import { Device } from '../src';
import { expect, test } from '@jest/globals';
import {
  ControllerDevice,
  RoomThermostatDevice,
  ThermostatDevice,
} from './data/unparsed';
import { ProductType } from '../src/api/ProductType';
import { BatteryLevel } from '../src/api/BatteryLevel';

test('new Device() parses controller type device', () => {
  const device = new Device(ControllerDevice);

  expect(device.id).toBe(0);
  expect(device.productType).toBe(ProductType.HeatHub);
  expect(device.serialNumber).toBeUndefined();
  expect(device.batteryLevel).toBeUndefined();
  expect(device.firmwareVersion).toBe('2.54.0');
  expect(device.deviceLocked).toBeFalsy();
});

test('new Device() parses thermostat type device', () => {
  const device = new Device(ThermostatDevice);

  expect(device.id).toBe(1);
  expect(device.productType).toBe(ProductType.Thermostat);
  expect(device.serialNumber).toBe('0038853FE2AC9EBB');
  expect(device.batteryLevel).toBe(BatteryLevel.TwoThirds);
  expect(device.firmwareVersion).toBe('0201000000054000');
  expect(device.deviceLocked).toBeTruthy();
});

test('new Device() parses room stat type device', () => {
  const device = new Device(RoomThermostatDevice);

  expect(device.id).toBe(5);
  expect(device.productType).toBe(ProductType.RoomStat);
  expect(device.serialNumber).toBe('33841DEEA92F92A3');
  expect(device.batteryLevel).toBe(BatteryLevel.Low);
  expect(device.firmwareVersion).toBe('04E1000900042002');
  expect(device.deviceLocked).toBeFalsy();
});
