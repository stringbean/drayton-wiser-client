import { ControlType, HeatingType } from '../constants';

export default interface Room {
  id: number;
  ManualSetPoint?: number;
  ScheduleId: number;
  ComfortModeScore: number;
  HeatingRate: number;
  RoomStatId?: number;
  SmartValveIds?: number[];
  Name: string;
  Mode: string;
  DemandType?: string;
  WindowDetectionActive: boolean;
  ControlSequenceOfOperation: ControlType;
  HeatingType: HeatingType;
  CalculatedTemperature: number;
  CurrentSetPoint: number;
  ControlOutputState?: string;
  WindowState?: string;
  SetpointOrigin: string;
  DisplayedSetPoint: number;
  ScheduledSetPoint: number;
  AwayModeSuppressed?: boolean;
  RoundedAlexaTemperature?: number;
  EffectiveMode: string;
  PercentageDemand?: number;
  PercentageDemandForItrv?: number;
  Invalid?: string;
  OverrideType?: string;
  OverrideSetpoint?: number;
  ComfortTarget?: number;
}
