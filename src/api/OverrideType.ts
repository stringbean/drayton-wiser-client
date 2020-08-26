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
