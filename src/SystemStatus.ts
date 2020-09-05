import ApiSystem from './api/responses/SystemStatus';
import { temperatureFromApi } from './utils';

/**
 * Current status of a Wiser system.
 */
export class SystemStatus {
  /**
   * Software version of the HeatHub.
   */
  readonly version: string;

  /**
   * Whether Eco mode is enabled.
   */
  readonly ecoMode: boolean;

  /**
   * Whether Away mode is active.
   */
  readonly awayMode: boolean;

  /**
   * Set point temperature of Away mode.
   */
  readonly awayModeSetPoint: number;

  /**
   * Whether the physical heating override button has been pressed.
   */
  readonly heatingOverrideEnabled: boolean;

  /**
   * Whether any rooms have overrides set.
   */
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
