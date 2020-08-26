/**
 * Current scheduling mode for a room.
 * @internal
 */
export enum RoomMode {
  /**
   * Normal scheduling for this room has been disabled and the only heat applied
   * will be to prevent freezing.
   *
   * This mode will not expire and will remain active until manually disabled.
   */
  Off,
  /**
   * Normal scheduling for this room has been disabled and a preset 'away' mode
   * temperature set.
   *
   * This mode will not expire and will remain active until manually disabled.
   */
  Away,
  /**
   * Normal scheduling is active for this room without any overrides.
   */
  Auto,
  /**
   * A temporary boost has been set above the scheduled temperature.
   *
   * This boost will expire after a set period of time.
   */
  Boost,
  /**
   * A manual override temperature has been set.
   *
   * This override will not expire and will remain active until manually disabled.
   */
  Manual,
  /**
   * Mode for this room could not be determined.
   */
  Unknown = -1,
}
