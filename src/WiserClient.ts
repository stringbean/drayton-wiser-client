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

  /**
   * Fetch the status of all rooms in the system.
   *
   * @return the status of each room.
   */
  roomStatuses(): Promise<Room[]> {
    return this.request('domain/Room').then((response) => {
      if (response.status === 200) {
        const apiRooms: ApiRoom[] = response.json;
        return Promise.resolve(apiRooms.map((r) => new Room(r)));
      }

      return Promise.reject(new Error('unexpected-response'));
    });
  }

  /**
   * Fetch the status of an individual room.
   *
   * @param id system ID of the room to fetch.
   * @return status of the room or `undefined` if not found.
   */
  roomStatus(id: number): Promise<Room | undefined> {
    return this.request(`domain/Room/${id}`).then((response) => {
      if (response.status === 200) {
        return new Room(response.json);
      }
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
            return response.json().then((json) => {
              return {
                status: 200,
                json,
              };
            });
          } else {
            return Promise.resolve({
              status: response.status,
            });
          }
        },
      );
    } else {
      return Promise.reject(new Error('system-not-found'));
    }
  }
}
