import { ControlType, HeatingType } from './constants';

import ApiRoom from './api/Room';

export default class Room {
  readonly id: number;
  readonly name: string;
  readonly isValid: boolean;
  readonly controlType: ControlType;
  readonly heatingType: HeatingType;
  readonly temperature?: number;
  readonly setTemperature?: number;
  readonly active?: boolean;

  constructor(json: ApiRoom) {
    this.id = json.id;
    this.name = json.Name;
    this.isValid = !json.Invalid;
    this.controlType = json.ControlSequenceOfOperation;
    this.heatingType = json.HeatingType;

    if (this.isValid) {
      this.temperature = Room.temperatureFromApi(json.CalculatedTemperature);
      this.setTemperature = Room.temperatureFromApi(json.CurrentSetPoint);
      this.active = json.ControlOutputState === 'On';
    }
  }

  private static temperatureFromApi(apiValue?: number): number | undefined {
    if (apiValue) {
      return apiValue / 10;
    }

    return undefined;
  }
}
