/* eslint-disable no-console */
import { table } from 'table';
import chalk from 'chalk';
import { program } from 'commander';
import { Room, WiserClient } from '../src';
import { BatteryLevel } from '../src/api/BatteryLevel';

program
  .version('0.0.1')
  .requiredOption('-s, --secret <secret>', 'Wiser system secret')
  .option('-a, --address <address>', 'IP or address of Wiser system');

program
  .command('status')
  .description('Fetch the system status')
  .action(systemStatus);

program
  .command('devices')
  .description('List all devices in the system')
  .action(listDevices);

program
  .command('device <id>')
  .description('Show status of a device')
  .action(deviceStatus);

program
  .command('rooms')
  .description('List status of all rooms')
  .action(listRooms);

program
  .command('room <id>')
  .description('Show status of a room')
  .action(roomStatus);

program
  .command('override-room <roomId> <temp>')
  .description('Override the set point of a room')
  .action(overrideRoom);

program
  .command('cancel-override <roomId>')
  .description('Cancel an override set on a room')
  .action(cancelRoomOverride);

program
  .command('disable-room <roomId>')
  .description('Turn off radiators in a room')
  .action(disableRoom);

program
  .command('away <on|off>')
  .description('Enable or disable away mode')
  .action(setAwayMode);

program
  .command('boost-all')
  .description('Boost all rooms')
  .action(boostAllRooms);

program
  .command('cancel-all-overrides')
  .description('Cancel all manual overrides and boosts')
  .action(cancelAllOverrides);

program.parse(process.argv);

function createClient(): WiserClient {
  if (program.address) {
    return WiserClient.clientWithAddress(program.secret, program.address);
  }

  return WiserClient.clientWithDiscovery(program.secret);
}

function systemStatus(): void {
  const client = createClient();

  client.systemStatus().then((status) => {
    console.log(status);
  });
}

function listDevices(): void {
  const client = createClient();

  client
    .listDevices()
    .then((devices) => {
      const data = [
        [
          chalk.bold('ID'),
          chalk.bold('Type'),
          chalk.bold('Serial'),
          chalk.bold('Battery'),
          chalk.bold('Locked?'),
        ],
      ];

      devices.forEach((device) => {
        let battery = '';

        switch (device.batteryLevel) {
          case BatteryLevel.Normal:
            battery = chalk.green('Normal');
            break;

          case BatteryLevel.TwoThirds:
            battery = chalk.green('Two-Thirds');
            break;

          case BatteryLevel.OneThird:
            battery = chalk.yellow('One-Thirds');
            break;

          case BatteryLevel.Low:
            battery = chalk.red('Low');
        }

        data.push([
          device.id.toString(),
          device.productType,
          device.serialNumber ? device.serialNumber : '',
          battery,
          device.deviceLocked ? '✔' : '',
        ]);
      });

      console.log(table(data));
    })
    .catch(handleError);
}

function deviceStatus(id: number): void {
  const client = createClient();

  client
    .deviceStatus(id)
    .then((device) => {
      console.log('device status', device);
    })
    .catch(handleError);
}

function listRooms(): void {
  const client = createClient();

  client
    .roomStatuses()
    .then((statuses) => {
      printRoomStatuses(statuses);
    })
    .catch(handleError);
}

function roomStatus(id: number): void {
  const client = createClient();

  client
    .roomStatus(id)
    .then((status) => console.log('room status', status))
    .catch(handleError);
}

function overrideRoom(roomId: number, temp: number): void {
  const client = createClient();
  client
    .overrideRoomSetPoint(roomId, temp)
    .then((status) => console.log('updated status', status));
}

function cancelRoomOverride(roomId: number): void {
  const client = createClient();
  client
    .cancelRoomOverride(roomId)
    .then((status) => console.log('updated status', status));
}

function disableRoom(roomId: number): void {
  const client = createClient();
  client
    .disableRoom(roomId)
    .then((status) => console.log('updated status', status));
}

function setAwayMode(opt: string): void {
  const client = createClient();

  if (opt === 'on') {
    client.enableAwayMode().then((status) => {
      console.log('Enabled away mode');
      printRoomStatuses(status.rooms);
    });
  } else if (opt === 'off') {
    client.disableAwayMode().then((status) => {
      console.log('Disabled away mode');
      printRoomStatuses(status.rooms);
    });
  } else {
    program.help();
  }
}

function boostAllRooms(): void {
  const client = createClient();

  client.boostAllRooms().then((status) => {
    console.log('Boosted all rooms');
    printRoomStatuses(status.rooms);
  });
}

function cancelAllOverrides(): void {
  const client = createClient();

  client.cancelAllOverrides().then((status) => {
    console.log('Cancelled all overrides');
    printRoomStatuses(status.rooms);
  });
}

function handleError(error: Error) {
  if (error.message === 'system-not-found') {
    console.error('Could not find system');
  } else {
    console.error('Failed to connect to system', error);
  }
}

function printRoomStatuses(rooms: Room[]): void {
  const data = [
    [
      chalk.bold('ID'),
      chalk.bold('Name'),
      chalk.bold('Temp'),
      chalk.bold('Set Point'),
    ],
  ];

  rooms.forEach((room) => {
    let setpoint = '';

    if (room.setTemperature) {
      if (room.active) {
        setpoint = chalk.red(room.setTemperature.toString());
      } else {
        setpoint = chalk.blue(room.setTemperature.toString());
      }
    }

    data.push([
      room.id.toString(),
      room.name,
      room.temperature ? room.temperature.toString() : '',
      setpoint,
    ]);
  });

  console.log(table(data));
}
