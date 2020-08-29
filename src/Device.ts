import ApiDevice from './api/responses/Device';
import { ProductType } from './api/ProductType';
import { BatteryLevel } from './api/BatteryLevel';

/**
 * Details of a physical device in a Wiser system.
 */
export class Device {
  /**
   * Internal ID of the device.
   */
  readonly id: number;

  /**
   * Serial number of the device.
   *
   * Note that HeatHubs lack a serial number.
   */
  readonly serialNumber?: string;

  /**
   * Type of the device.
   */
  readonly productType: ProductType;

  /**
   * Current battery level of the device.
   *
   * This is only applicable for battery powered devices.
   */
  readonly batteryLevel?: BatteryLevel;

  /**
   * Whether the physical controls have been locked on the device.
   */
  readonly deviceLocked: boolean;

  /**
   * Current firmware installed on the device.
   */
  readonly firmwareVersion: string;

  constructor(json: ApiDevice) {
    this.id = json.id;
    this.serialNumber = json.SerialNumber;
    this.productType = json.ProductType;
    this.batteryLevel = json.BatteryLevel;
    this.deviceLocked = json.DeviceLockEnabled;
    this.firmwareVersion = json.ActiveFirmwareVersion;
  }
}
