import Room from './Room';
import ApiRoom from './api/Room';
import fetch from 'node-fetch';

export default class WiserClient {
  private readonly secret: string;
  private readonly ip?: string;

  constructor(secret: string, ip?: string) {
    // TODO auto-detect IP if not set
    this.secret = secret;
    this.ip = ip;
  }

  roomStatuses(): Promise<Room[]> {
    return this.request('domain/Room').then((json) => {
      const apiRooms: ApiRoom[] = json;
      return apiRooms.map((r) => new Room(r));
    });
  }

  private request(endpoint: string): Promise<any> {
    if (this.ip) {
      const headers = {
        SECRET: this.secret,
        Accept: 'application/json',
      };

      return fetch(`http://${this.ip}/data/${endpoint}`, { headers }).then(
        (response) => {
          if (response.ok) {
            return response.json();
          } else {
            return Promise.reject(
              new Error(`Error response from API ${response.status}`),
            );
          }
        },
      );
    } else {
      return Promise.reject(new Error('Could not find system'));
    }
  }
}
