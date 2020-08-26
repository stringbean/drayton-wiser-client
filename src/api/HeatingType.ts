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
