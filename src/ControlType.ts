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