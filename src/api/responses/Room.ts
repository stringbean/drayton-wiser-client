import { ControlType } from '../ControlType';
import { HeatingType } from '../HeatingType';
import { SetpointOrigin } from '../SetpointOrigin';

export default interface Room {
  id: number;
  ManualSetPoint?: number;
  ScheduleId: number;
  ComfortModeScore?: number;
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
  SetpointOrigin: SetpointOrigin;
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
