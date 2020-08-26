import { Room } from './Room';
import ApiRoom from './api/responses/Room';
import fetch, { HeadersInit, RequestInit } from 'node-fetch';
import { UpdateRequest } from './api/requests/UpdateRequest';
import { OverrideRequest } from './api/requests/OverrideRequest';
import { MAX_SET_POINT, MIN_SET_POINT, OFF_SET_POINT } from './constants';
import { temperatureToApi } from './utils';
import { OverrideType } from './api/OverrideType';

export class WiserClient {
  private readonly secret: string;
  private readonly ip?: string;

  /**
   * Creates a new client instance to connect to the specifed Wiser HomeHub.
   *
   * @param secret secret key for the HomeHub.
   * @param ip IP address or hostname of the HomeHub.
   */
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
  async roomStatuses(): Promise<Room[]> {
    const response = await this.request('domain/Room');

    if (response.status === 200) {
      const apiRooms: ApiRoom[] = response.json;
      return apiRooms.map((r) => new Room(r));
    }

    throw new Error('unexpected-response');
  }

  /**
   * Fetch the status of an individual room.
   *
   * @param id system ID of the room to fetch.
   * @return status of the room or `undefined` if not found.
   */
  async roomStatus(id: number): Promise<Room> {
    const response = await this.request(`domain/Room/${id}`);

    if (response.status === 200) {
      return new Room(response.json);
    }

    if (response.status === 404) {
      throw new Error('room-not-found');
    }

    throw new Error('unexpected response');
  }

  /**
   * Overrides the set point of an individual room.
   *
   * @param roomId system ID of the room to override.
   * @param setPoint temperature to set the room to (in Celsius).
   * @return updated status of the room.
   */
  async overrideRoomSetPoint(roomId: number, setPoint: number): Promise<Room> {
    if (setPoint < MIN_SET_POINT || setPoint > MAX_SET_POINT) {
      return Promise.reject(
        new RangeError('setPoint must be between 5 and 30'),
      );
    }

    return this.overrideRoom(roomId, OverrideType.Manual, setPoint);
  }

  /**
   * Disables (turns off) the radiators in a room.
   *
   * @param roomId  system ID of the room to disable.
   * @return updated status of the room.
   */
  async disableRoom(roomId: number): Promise<Room> {
    return this.overrideRoom(roomId, OverrideType.Manual, OFF_SET_POINT);
  }

  /**
   * Cancel any overrides set on a room.
   *
   * @param roomId system ID of the room to clear overrides for.
   * @return updated status of the room.
   */
  async cancelRoomOverride(roomId: number): Promise<Room> {
    return this.overrideRoom(roomId, OverrideType.None);
  }

  private async overrideRoom(
    roomId: number,
    type: OverrideType,
    setPoint?: number,
  ): Promise<Room> {
    const payload: OverrideRequest = {
      RequestOverride: {
        Type: type,
      },
    };

    if (setPoint) {
      payload.RequestOverride.SetPoint = temperatureToApi(setPoint);
    }

    const response = await this.request(
      `domain/Room/${roomId}`,
      'PATCH',
      payload,
    );

    if (response.status === 200) {
      // wiser returns a stale room status so we need to re-request an update
      return this.roomStatus(roomId);
    }

    if (response.status === 404) {
      throw new Error('room-not-found');
    }

    throw new Error('unexpected-response');
  }

  private async request(
    endpoint: string,
    method = 'GET',
    body?: UpdateRequest,
  ): Promise<any> {
    if (this.ip) {
      const headers: HeadersInit = {
        SECRET: this.secret,
        Accept: 'application/json',
      };

      const args: RequestInit = {
        headers,
        method: method,
      };

      if (body) {
        headers['Content-Type'] = 'application/json';
        args.body = JSON.stringify(body);
      }

      const response = await fetch(`http://${this.ip}/data/${endpoint}`, args);

      if (response.ok) {
        const json = await response.json();

        return {
          status: 200,
          json,
        };
      }

      return {
        status: response.status,
      };
    } else {
      throw new Error('system-not-found');
    }
  }
}
