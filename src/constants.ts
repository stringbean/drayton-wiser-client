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
