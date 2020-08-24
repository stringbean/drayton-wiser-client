import Room from './Room';
import ApiRoom from './api/Room';
import fetch, { RequestInit } from 'node-fetch';
import { OverrideRequest, UpdateRequest } from './payloads';
import {
  MAX_SET_POINT,
  MIN_SET_POINT,
  OFF_SET_POINT,
  OverrideType,
} from './constants';
import { temperatureToApi } from './utils';

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
  roomStatus(id: number): Promise<Room> {
    return this.request(`domain/Room/${id}`).then((response) => {
      if (response.status === 200) {
        return new Room(response.json);
      }

      if (response.status === 404) {
        throw new Error('room-not-found');
      }

      throw new Error('unexpected response');
    });
  }

  /**
   * Overrides the set point of an individual room.
   *
   * @param roomId system ID of the room to override.
   * @param setPoint temperature to set the room to.
   * @return updated status of the room.
   */
  overrideRoomSetPoint(roomId: number, setPoint: number): Promise<Room> {
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
  disableRoom(roomId: number): Promise<Room> {
    return this.overrideRoom(roomId, OverrideType.Manual, OFF_SET_POINT);
  }

  /**
   * Cancel any overrides set on a room.
   *
   * @param roomId system ID of the room to clear overrides for.
   * @return updated status of the room.
   */
  cancelRoomOverride(roomId: number): Promise<Room> {
    return this.overrideRoom(roomId, OverrideType.None);
  }

  private overrideRoom(
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

    console.log('payload', payload);

    return this.request(`domain/Room/${roomId}`, 'PATCH', payload).then(
      (response) => {
        if (response.status === 200) {
          // wiser returns a stale room status so we need to re-request an update
          return this.roomStatus(roomId);
        }

        if (response.status === 404) {
          throw new Error('room-not-found');
        }

        console.error(`unexpected response status: ${response.status}`);
        throw new Error('unexpected response');
      },
    );
  }

  private request(
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

      return fetch(`http://${this.ip}/data/${endpoint}`, args).then(
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
