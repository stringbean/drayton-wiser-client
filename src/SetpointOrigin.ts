export enum SetpointOrigin {
  FromSchedule = 'FromSchedule',
  FromManualOverride = 'FromManualOverride',
  FromBoost = 'FromBoost',
  FromAwayMode = 'FromAwayMode',
  Unknown = 'Unknown',
}

export function parseSetpointOrigin(s: string): SetpointOrigin {
  const parsed = Object.values(SetpointOrigin).find((t) => t === s);

  if (parsed) {
    return parsed;
  }

  return SetpointOrigin.Unknown;
}