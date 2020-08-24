export function temperatureFromApi(apiValue?: number): number | undefined {
  if (apiValue) {
    return apiValue / 10;
  }

  return undefined;
}

export function temperatureToApi(temperature?: number): number | undefined {
  if (temperature) {
    return Math.floor(temperature * 10);
  }

  return undefined;
}
