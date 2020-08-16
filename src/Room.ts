import { ControlType, HeatingType } from './constants';

import ApiRoom from './api/Room';

export default class Room {
  readonly id: number;
  readonly name: string;
  readonly isValid: boolean;
  readonly controlType: ControlType;
  readonly heatingType: HeatingType;

  constructor(json: ApiRoom) {
    this.id = json.id;
    this.name = json.Name;
    this.isValid = !json.Invalid;
    this.controlType = json.ControlSequenceOfOperation;
    this.heatingType = json.HeatingType;
  }
}
