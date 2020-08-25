# drayton-wiser-client

![Travis](https://img.shields.io/travis/com/stringbean/drayton-wiser-client)
![npm (scoped)](https://img.shields.io/npm/v/@stringbean/drayton-wiser-client)
![node support](https://img.shields.io/node/v-lts/@stringbean/drayton-wiser-client)

This is heavily based on the [wiserheatingapi](https://github.com/asantaga/wiserheatingapi) Python package and 
the work by [Julian Knight](https://it.knightnet.org.uk/kb/nr-qa/drayton-wiser-heating-control/).

## Running the example app

1. Obtain the secret key for your system:
    1. Press the setup button on your HeatHub.
    2. Connect your phone or PC to the temporary setup Wi-Fi hotspot called `WiserHeatXXX`.
    3. Fetch the secret using a REST client (or just open in a browser) from: http://192.168.8.1/secret/
    4. Press the setup button on your HeatHub to exit setup mode.
2. Find the IP address of your HeatHub - it should appear on Bonjour/Zeroconf as `WiserHeatXXX` supporting `_http.tcp`.
3. List the status of your rooms using the demo app:
    ```shell script
     npm run demo -- -s $SECRET_KEY -a $IP_ADDRESS list
    ```

## Using the client

To create a client pass in the secret and address of the HeatHub, then start calling operations:

```typescript
import WiserClient from 'WiserClient';

const client = new WiserClient('secret', '192.168.1.10');
const statuses = await client.roomStatuses();

statuses.forEach((room) => {
  if (room.valid) {
    console.log(`${room.name}: ${room.temperature}ºc`);
  } else {
    console.log(`${room.name}: (invalid)`);
  }
});
```

Examples of each operation can be found in the example app.

## Supported Operations

* List room statuses: `client.roomStatuses()`.
* Single room status: `client.roomStatus(roomId)`.
* Manually set room target: `client.overrideRoomSetPoint(roomId, setPoint)`.
* Turn off a room: `client.disableRoom(roomId)`.
* Cancel room overrides: `client.cancelRoomOverride(roomId)`.