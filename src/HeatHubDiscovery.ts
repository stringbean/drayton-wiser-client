import Bonjour from 'bonjour';

export const DEFAULT_HUB_PREFIX = 'WiserHeat';
const DISCOVERY_TIMEOUT = 5 * 1000;

export class HeatHubDiscovery {
  private discoveredHub?: string | null;

  private discoveryPromise?: Promise<string | null>;
  private discoveryTimeout?: NodeJS.Timeout;

  constructor(readonly prefix = DEFAULT_HUB_PREFIX) {
    // eagerly start the discovery
    this.startDiscovery();
  }

  discoverHub(): Promise<string | null> {
    if (this.discoveredHub !== undefined) {
      return Promise.resolve(this.discoveredHub);
    }

    if (this.discoveryPromise) {
      return this.discoveryPromise;
    }

    return this.startDiscovery();
  }

  forceRefresh(): void {
    this.discoveredHub = undefined;
  }

  private startDiscovery() {
    const bonjour = Bonjour();

    const timeoutPromise: Promise<string | null> = new Promise((resolve) => {
      this.discoveryTimeout = setTimeout(() => {
        bonjour.destroy();
        resolve(null);
      }, DISCOVERY_TIMEOUT);
    });

    const bonjourPromise: Promise<string | null> = new Promise((resolve) => {
      bonjour.find({ type: 'http' }, (service) => {
        if (service.name.startsWith(this.prefix)) {
          // found a matching device
          bonjour.destroy();

          if (this.discoveryTimeout) {
            // cancel the timeout race
            clearInterval(this.discoveryTimeout);
          }

          resolve(service.host);
        }
      });
    });

    this.discoveryPromise = Promise.race([bonjourPromise, timeoutPromise]);
    return this.discoveryPromise;
  }
}
