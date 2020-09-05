import ApiSystem from './api/responses/SystemStatus';
import { temperatureFromApi } from './utils';

export class SystemStatus {
  readonly version: string;
  readonly ecoMode: boolean;
  readonly awayMode: boolean;
  readonly awayModeSetPoint: number;
  readonly heatingOverrideEnabled: boolean;
  readonly overridesActive: boolean;

  constructor(json: ApiSystem) {
    this.version = json.ActiveSystemVersion;
    this.ecoMode = json.EcoModeEnabled;
    this.awayMode = json.OverrideType === 'Away';
    this.awayModeSetPoint = <number>(
      temperatureFromApi(json.AwayModeSetPointLimit)
    );
    this.heatingOverrideEnabled = json.HeatingButtonOverrideState === 'On';
    this.overridesActive = json.UserOverridesActive || false;
  }
}
