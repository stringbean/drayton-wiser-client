import { OFF_SET_POINT } from './constants';

import ApiRoom from './api/responses/Room';
import { temperatureFromApi } from './utils';
import { ControlType } from './api/ControlType';
import { HeatingType } from './api/HeatingType';
import { RoomMode } from './RoomMode';
import { SetpointOrigin } from './api/SetpointOrigin';

export class Room {
  readonly id: number;
  readonly name: string;
  readonly isValid: boolean;
  readonly controlType: ControlType;
  readonly heatingType: HeatingType;
  readonly temperature?: number;
  readonly setTemperature?: number;
  readonly active?: boolean;
  readonly mode: RoomMode;

  constructor(json: ApiRoom) {
    this.id = json.id;
    this.name = json.Name;
    this.isValid = !json.Invalid;
    this.controlType = json.ControlSequenceOfOperation;
    this.heatingType = json.HeatingType;

    if (this.isValid) {
      this.temperature = temperatureFromApi(json.CalculatedTemperature);

      const setTemperature = temperatureFromApi(json.CurrentSetPoint);
      if (setTemperature !== OFF_SET_POINT) {
        this.setTemperature = setTemperature;
      }
      this.active = json.PercentageDemand ? json.PercentageDemand > 0 : false;

      switch (json.SetpointOrigin) {
        case SetpointOrigin.FromAwayMode:
          this.mode = RoomMode.Away;
          break;

        case SetpointOrigin.FromBoost:
          this.mode = RoomMode.Boost;
          break;

        case SetpointOrigin.FromManualOverride:
        case SetpointOrigin.FromManualOverrideDuringAway:
          if (this.setTemperature) {
            this.mode = RoomMode.Manual;
          } else {
            this.mode = RoomMode.Off;
          }
          break;

        case SetpointOrigin.FromSchedule:
          this.mode = RoomMode.Auto;
          break;

        default:
          this.mode = RoomMode.Unknown;
      }
    } else {
      this.mode = RoomMode.Unknown;
    }
  }
}
