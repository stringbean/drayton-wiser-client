export enum ControlType {
  HeatingOnly = 'HeatingOnly',
  Unknown = 'Unknown',
}

export function parseControlType(s: string): ControlType {
  const parsed = Object.values(ControlType).find((t) => t === s);

  if (parsed) {
    return parsed;
  }

  return ControlType.Unknown;
}

export enum HeatingType {
  HydronicRadiator = 'HydronicRadiator',
  Unknown = 'Unknown',
}

export function parseHeatingType(s: string): HeatingType {
  const parsed = Object.values(HeatingType).find((t) => t === s);

  if (parsed) {
    return parsed;
  }

  return HeatingType.Unknown;
}

export enum OverrideType {
  None = 'None',
  Manual = 'Manual',
  Unknown = 'Unknown',
}

export function parseOverrideType(s: string): OverrideType {
  const parsed = Object.values(OverrideType).find((t) => t === s);

  if (parsed) {
    return parsed;
  }

  return OverrideType.Unknown;
}

export const MIN_SET_POINT = 5;
export const MAX_SET_POINT = 30;
export const OFF_SET_POINT = -20;
