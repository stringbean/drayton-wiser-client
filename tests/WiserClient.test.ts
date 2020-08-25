import { afterEach, describe, expect, test } from '@jest/globals';
import { WiserClient } from '../src';
import * as parsed from './data/parsed';
import * as unparsed from './data/unparsed';
import fetchMock from 'jest-fetch-mock';

const client = new WiserClient('wiser-secret', 'wiser.test');
const invalidClient = new WiserClient('secret');

afterEach(() => {
  fetchMock.resetMocks();
});

describe('roomStatuses', () => {
  test('lists the statuses of all rooms', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify([unparsed.InvalidRoom, unparsed.ValidRoom]),
    );

    const results = await client.roomStatuses();
    expect(results).toEqual([parsed.InvalidRoom, parsed.ValidRoom]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectFetch({ url: 'http://wiser.test/data/domain/Room' });
  });

  test('rejects with system-not-found if not connected', async () => {
    expect.assertions(2);

    try {
      await invalidClient.roomStatuses();
    } catch (error) {
      expect(error.message).toEqual('system-not-found');
    }

    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('roomStatus', () => {
  test('gets the status of a room', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(unparsed.ValidRoom));

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

  test('rejects with system-not-found if not connected', async () => {
    expect.assertions(1);

    try {
      await invalidClient.roomStatus(3);
    } catch (error) {
      expect(error.message).toEqual('system-not-found');
    }
  });

  expect(fetchMock).not.toHaveBeenCalled();
});

describe('overrideRoomSetPoint', () => {
  test('overrides the set point for a room', async () => {
    // API gets called twice - once for the update & once to fetch updated
    fetchMock.mockResponses(
      JSON.stringify(unparsed.ValidRoom),
      JSON.stringify(unparsed.ValidRoom),
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

  test('rejects with system-not-found if not connected', async () => {
    expect.assertions(2);

    try {
      await invalidClient.overrideRoomSetPoint(3, 25);
    } catch (error) {
      expect(error.message).toEqual('system-not-found');
    }

    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('disableRoom', () => {
  test('overrides the set point of a room to -30', async () => {
    // API gets called twice - once for the update & once to fetch updated
    fetchMock.mockResponses(
      JSON.stringify(unparsed.ValidRoom),
      JSON.stringify(unparsed.ValidRoom),
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

  test('rejects with system-not-found if not connected', async () => {
    expect.assertions(2);

    try {
      await invalidClient.disableRoom(6);
    } catch (error) {
      expect(error.message).toEqual('system-not-found');
    }

    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('cancelRoomOverride', () => {
  test('cancels any room overrides', async () => {
    // API gets called twice - once for the update & once to fetch updated
    fetchMock.mockResponses(
      JSON.stringify(unparsed.ValidRoom),
      JSON.stringify(unparsed.ValidRoom),
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

  test('rejects with system-not-found if not connected', async () => {
    expect.assertions(2);

    try {
      await invalidClient.cancelRoomOverride(6);
    } catch (error) {
      expect(error.message).toEqual('system-not-found');
    }

    expect(fetchMock).not.toHaveBeenCalled();
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
