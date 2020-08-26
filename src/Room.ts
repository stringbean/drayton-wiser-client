import { OFF_SET_POINT } from './constants';

import ApiRoom from './api/responses/Room';
import { temperatureFromApi } from './utils';
import { ControlType } from './api/ControlType';
import { HeatingType } from './api/HeatingType';

export class Room {
  readonly id: number;
  readonly name: string;
  readonly isValid: boolean;
  readonly controlType: ControlType;
  readonly heatingType: HeatingType;
  readonly temperature?: number;
  readonly setTemperature?: number;
  readonly active?: boolean;
  readonly disabled?: boolean;

  // TODO manual mode

  // TODO enumeration of:
  // auto
  // off
  // boost
  // manual mode

  constructor(json: ApiRoom) {
    this.id = json.id;
    this.name = json.Name;
    this.isValid = !json.Invalid;
    this.controlType = json.ControlSequenceOfOperation;
    this.heatingType = json.HeatingType;

    if (this.isValid) {
      this.temperature = temperatureFromApi(json.CalculatedTemperature);
      this.setTemperature = temperatureFromApi(json.CurrentSetPoint);
      this.active = json.PercentageDemand ? json.PercentageDemand > 0 : false;
      this.disabled = this.setTemperature === OFF_SET_POINT;
    }
  }
}
