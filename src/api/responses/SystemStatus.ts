import { SystemDate } from './SystemDate';
import { BoilerSettings } from './BoilerSettings';

export default interface SystemStatus {
  PairingStatus: string;
  TimeZoneOffset: number;
  AutomaticDaylightSaving: boolean;
  SystemMode: string;
  FotaEnabled: boolean;
  ValveProtectionEnabled: boolean;
  EcoModeEnabled: boolean;
  AwayModeAffectsHotWater: boolean;
  AwayModeSetPointLimit: number;
  BoilerSettings: BoilerSettings;
  CoolingModeDefaultSetpoint: number;
  CoolingAwayModeSetpointLimit: number;
  ComfortModeEnabled: boolean;
  PreheatTimeLimit: number;
  DegradedModeSetpointThreshold: number;
  UnixTime: number;
  ActiveSystemVersion: string;
  ZigbeePermitJoinActive?: boolean;
  BrandName: string;
  CloudConnectionStatus: string;
  LocalDateAndTime: SystemDate;
  HeatingButtonOverrideState: string;
  UserOverridesActive?: boolean;
  HotWaterButtonOverrideState: string;
  OpenThermConnectionStatus: string;
  OverrideType?: string;
}
