import { ControlType, HeatingType, OFF_SET_POINT } from './constants';

import ApiRoom from './api/Room';
import { temperatureFromApi } from './utils';

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

  constructor(json: ApiRoom) {
    this.id = json.id;
    this.name = json.Name;
    this.isValid = !json.Invalid;
    this.controlType = json.ControlSequenceOfOperation;
    this.heatingType = json.HeatingType;

    if (this.isValid) {
      this.temperature = temperatureFromApi(json.CalculatedTemperature);
      this.setTemperature = temperatureFromApi(json.CurrentSetPoint);
      this.active = json.ControlOutputState === 'On';
      this.disabled = this.setTemperature === OFF_SET_POINT;
    }
  }
}
