import { afterEach, describe, expect, test } from '@jest/globals';
import { WiserClient } from '../src';
import * as parsed from './data/parsed';
import * as unparsed from './data/unparsed';
import fetchMock from 'jest-fetch-mock';
import { FetchError } from 'node-fetch';
import { mocked } from 'ts-jest/utils';
import { HeatHubDiscovery } from '../src/HeatHubDiscovery';

const client = WiserClient.clientWithAddress('wiser-secret', 'wiser.test');

const mockDiscoverHub = jest.fn();

jest.mock('../src/HeatHubDiscovery', () => {
  return {
    HeatHubDiscovery: jest.fn().mockImplementation(() => {
      return {
        discoverHub: mockDiscoverHub,
      };
    }),
  };
});

afterEach(() => {
  fetchMock.resetMocks();
});

describe('clientWithAddress', () => {
  test('should connect to specified address', async () => {
    fetchMock.mockResponseOnce(JSON.stringify([]));

    const results = await client.roomStatuses();
    expect(results).toEqual([]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectFetch({ url: 'http://wiser.test/data/domain/Room' });
  });

  test('should error if cannot connect to specified address', async () => {
    expect.assertions(3);
    const err = <FetchError>new Error('could not connect');
    err.type = 'request-timeout';

    fetchMock.mockReject(err);

    try {
      await client.roomStatuses();
    } catch (error) {
      expect(error.message).toEqual('system-not-found');
    }
    expectFetch({ url: 'http://wiser.test/data/domain/Room' });
  });
});

describe('clientWithDiscovery', () => {
  test('should discover hub address', async () => {
    mockDiscoverHub.mockResolvedValue('wiser-detected.test');

    const discoClient = WiserClient.clientWithDiscovery('wiser-secret');

    fetchMock.mockResponseOnce(JSON.stringify([]));

    await discoClient.roomStatuses();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectFetch({ url: 'http://wiser-detected.test/data/domain/Room' });
    expect(mockDiscoverHub).toHaveBeenCalled();
    expect(mocked(HeatHubDiscovery).mock.calls[0][0]).toBeUndefined();
  });

  test('should discover hub address with specified prefix', async () => {
    mockDiscoverHub.mockResolvedValue('wiser-detected-prefix.test');

    const discoClient = WiserClient.clientWithDiscovery(
      'wiser-secret',
      'wiser',
    );

    fetchMock.mockResponseOnce(JSON.stringify([]));

    await discoClient.roomStatuses();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectFetch({ url: 'http://wiser-detected-prefix.test/data/domain/Room' });
    expect(mockDiscoverHub).toHaveBeenCalled();

    expect(mocked(HeatHubDiscovery).mock.calls[0][0]).toEqual('wiser');
  });

  test('should error if cannot connect to discovered address', async () => {
    expect.assertions(5);

    mockDiscoverHub.mockResolvedValue('wiser-detected.test');
    const err = <FetchError>new Error('could not connect');
    err.type = 'request-timeout';

    const discoClient = WiserClient.clientWithDiscovery('wiser-secret');

    fetchMock.mockReject(err);

    try {
      await discoClient.roomStatuses();
    } catch (error) {
      expect(error.message).toEqual('system-not-found');
    }

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectFetch({ url: 'http://wiser-detected.test/data/domain/Room' });
    expect(mockDiscoverHub).toHaveBeenCalled();
  });

  test('should error if discovery fails', async () => {
    expect.assertions(3);

    mockDiscoverHub.mockResolvedValue(undefined);

    const discoClient = WiserClient.clientWithDiscovery('wiser-secret');

    try {
      await discoClient.roomStatuses();
    } catch (error) {
      expect(error.message).toEqual('system-not-found');
    }

    expect(fetchMock).not.toHaveBeenCalled();
    expect(mockDiscoverHub).toHaveBeenCalled();
  });
});

describe('devices', () => {
  test('lists all devices', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify([
        unparsed.ControllerDevice,
        unparsed.ThermostatDevice,
        unparsed.RoomThermostatDevice,
      ]),
    );

    const results = await client.listDevices();
    expect(results).toEqual([
      parsed.ControllerDevice,
      parsed.ThermostatDevice,
      parsed.RoomThermostatDevice,
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectFetch({ url: 'http://wiser.test/data/domain/Device' });
  });
});

describe('deviceStatus', () => {
  test('gets the status of a device', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(unparsed.ControllerDevice));

    const result = await client.deviceStatus(0);
    expect(result).toEqual(parsed.ControllerDevice);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectFetch({ url: 'http://wiser.test/data/domain/Device/0' });
  });

  test('rejects with device-not-found if device does not exist', async () => {
    expect.assertions(4);

    fetchMock.mockResponseOnce(JSON.stringify({ Error: '/Device/4' }), {
      status: 404,
    });

    try {
      await client.deviceStatus(4);
    } catch (error) {
      expect(error.message).toEqual('device-not-found');
    }

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectFetch({ url: 'http://wiser.test/data/domain/Device/4' });
  });
});

describe('roomStatuses', () => {
  test('lists the statuses of all rooms', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify([unparsed.InvalidRoom, unparsed.AutoRoom]),
    );

    const results = await client.roomStatuses();
    expect(results).toEqual([parsed.InvalidRoom, parsed.ValidRoom]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectFetch({ url: 'http://wiser.test/data/domain/Room' });
  });
});

describe('roomStatus', () => {
  test('gets the status of a room', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(unparsed.AutoRoom));

    const result = await client.roomStatus(6);
    expect(result).toEqual(parsed.ValidRoom);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectFetch({ url: 'http://wiser.test/data/domain/Room/6' });
  });

  test('rejects with room-not-found if room does not exist', async () => {
    expect.assertions(4);

    fetchMock.mockResponseOnce(JSON.stringify({ Error: '/Room/6' }), {
      status: 404,
    });

    try {
      await client.roomStatus(6);
    } catch (error) {
      expect(error.message).toEqual('room-not-found');
    }

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectFetch({ url: 'http://wiser.test/data/domain/Room/6' });
  });
});

describe('overrideRoomSetPoint', () => {
  test('overrides the set point for a room', async () => {
    // API gets called twice - once for the update & once to fetch updated
    fetchMock.mockResponses(
      JSON.stringify(unparsed.AutoRoom),
      JSON.stringify(unparsed.AutoRoom),
    );

    const result = await client.overrideRoomSetPoint(6, 12.5);
    expect(result).toEqual(parsed.ValidRoom);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expectFetch({
      url: 'http://wiser.test/data/domain/Room/6',
      method: 'PATCH',
      body: {
        RequestOverride: {
          Type: 'Manual',
          SetPoint: 125,
        },
      },
    });
    expectFetch({ url: 'http://wiser.test/data/domain/Room/6', call: 1 });
  });

  test('rejects with RangeError if setPoint is invalid', async () => {
    expect.assertions(3);

    try {
      await client.overrideRoomSetPoint(6, 30.1);
    } catch (error) {
      expect(error.message).toEqual('setPoint must be between 5 and 30');
    }

    try {
      await client.overrideRoomSetPoint(6, 4.9);
    } catch (error) {
      expect(error.message).toEqual('setPoint must be between 5 and 30');
    }

    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('rejects with room-not-found if room does not exist', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ Error: '/Room/6' }), {
      status: 404,
    });

    try {
      await client.overrideRoomSetPoint(6, 12.5);
    } catch (error) {
      expect(error.message).toEqual('room-not-found');
    }

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectFetch({
      url: 'http://wiser.test/data/domain/Room/6',
      method: 'PATCH',
      body: {
        RequestOverride: {
          Type: 'Manual',
          SetPoint: 125,
        },
      },
    });
  });

  test('rejects with unexpected-response on unexpected response', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ Error: 'bad request' }), {
      status: 400,
    });

    try {
      await client.overrideRoomSetPoint(6, 12.5);
    } catch (error) {
      expect(error.message).toEqual('unexpected-response');
    }

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectFetch({
      url: 'http://wiser.test/data/domain/Room/6',
      method: 'PATCH',
      body: {
        RequestOverride: {
          Type: 'Manual',
          SetPoint: 125,
        },
      },
    });
  });
});

describe('disableRoom', () => {
  test('overrides the set point of a room to -30', async () => {
    // API gets called twice - once for the update & once to fetch updated
    fetchMock.mockResponses(
      JSON.stringify(unparsed.AutoRoom),
      JSON.stringify(unparsed.AutoRoom),
    );

    const result = await client.disableRoom(6);
    expect(result).toEqual(parsed.ValidRoom);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expectFetch({
      url: 'http://wiser.test/data/domain/Room/6',
      method: 'PATCH',
      body: {
        RequestOverride: {
          Type: 'Manual',
          SetPoint: -200,
        },
      },
    });
    expectFetch({ url: 'http://wiser.test/data/domain/Room/6', call: 1 });
  });

  test('rejects with room-not-found if room does not exist', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ Error: '/Room/6' }), {
      status: 404,
    });

    try {
      await client.disableRoom(6);
    } catch (error) {
      expect(error.message).toEqual('room-not-found');
    }

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectFetch({
      url: 'http://wiser.test/data/domain/Room/6',
      method: 'PATCH',
      body: {
        RequestOverride: {
          Type: 'Manual',
          SetPoint: -200,
        },
      },
    });
  });

  test('rejects with unexpected-response on unexpected response', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ Error: 'bad request' }), {
      status: 400,
    });

    try {
      await client.disableRoom(6);
    } catch (error) {
      expect(error.message).toEqual('unexpected-response');
    }

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectFetch({
      url: 'http://wiser.test/data/domain/Room/6',
      method: 'PATCH',
      body: {
        RequestOverride: {
          Type: 'Manual',
          SetPoint: -200,
        },
      },
    });
  });
});

describe('cancelRoomOverride', () => {
  test('cancels any room overrides', async () => {
    // API gets called twice - once for the update & once to fetch updated
    fetchMock.mockResponses(
      JSON.stringify(unparsed.AutoRoom),
      JSON.stringify(unparsed.AutoRoom),
    );

    const result = await client.cancelRoomOverride(6);
    expect(result).toEqual(parsed.ValidRoom);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expectFetch({
      url: 'http://wiser.test/data/domain/Room/6',
      method: 'PATCH',
      body: {
        RequestOverride: {
          Type: 'None',
        },
      },
    });
    expectFetch({ url: 'http://wiser.test/data/domain/Room/6', call: 1 });
  });

  test('rejects with room-not-found if room does not exist', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ Error: '/Room/6' }), {
      status: 404,
    });

    try {
      await client.cancelRoomOverride(6);
    } catch (error) {
      expect(error.message).toEqual('room-not-found');
    }

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectFetch({
      url: 'http://wiser.test/data/domain/Room/6',
      method: 'PATCH',
      body: {
        RequestOverride: {
          Type: 'None',
        },
      },
    });
  });

  test('rejects with unexpected-response on unexpected response', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ Error: 'bad request' }), {
      status: 400,
    });

    try {
      await client.cancelRoomOverride(6);
    } catch (error) {
      expect(error.message).toEqual('unexpected-response');
    }

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectFetch({
      url: 'http://wiser.test/data/domain/Room/6',
      method: 'PATCH',
      body: {
        RequestOverride: {
          Type: 'None',
        },
      },
    });
  });
});

function expectFetch({ url, method = 'GET', call = 0, body }: FetchFoo): void {
  const [actualUrl, actualInit] = fetchMock.mock.calls[call];
  expect(actualUrl).toEqual(url);
  expect(actualInit?.method).toEqual(method);

  if (body) {
    expect(actualInit?.body).toEqual(JSON.stringify(body));
  }
}

interface FetchFoo {
  url: string;
  method?: string;
  call?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
}
