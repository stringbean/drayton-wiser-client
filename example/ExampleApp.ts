/* eslint-disable no-console */
import { table } from 'table';
import chalk from 'chalk';
import { program } from 'commander';
import { WiserClient } from '../src';

program
  .version('0.0.1')
  .option('-s, --secret <secret>', 'Wiser system secret')
  .option('-a, --address <address>', 'IP or address of Wiser system');

program
  .command('list')
  .description('List status of all rooms')
  .action(() => {
    listRooms();
  });

program
  .command('room <id>')
  .description('Show status of a room')
  .action((id) => {
    roomStatus(id);
  });

program
  .command('override-room <roomId> <temp>')
  .description('Override the set point of a room')
  .action((roomId, temp) => {
    overrideRoom(roomId, temp);
  });

program
  .command('cancel-override <roomId>')
  .description('Cancel an override set on a room')
  .action((roomId) => {
    cancelRoomOverride(roomId);
  });

program
  .command('disable-room <roomId>')
  .description('Turn off radiators in a room')
  .action((roomId) => {
    disableRoom(roomId);
  });

program.parse(process.argv);

function createClient(): WiserClient {
  return new WiserClient(program.secret, program.address);
}

function listRooms(): void {
  const client = createClient();

  client
    .roomStatuses()
    .then((statuses) => {
      const data = [
        [
          chalk.bold('ID'),
          chalk.bold('Name'),
          chalk.bold('Temp'),
          chalk.bold('Set Point'),
        ],
      ];

      statuses.forEach((room) => {
        let setpont = '';

        if (room.setTemperature) {
          if (room.active) {
            setpont = chalk.red(room.setTemperature.toString());
          } else {
            setpont = chalk.blue(room.setTemperature.toString());
          }
        }

        data.push([
          room.id.toString(),
          room.name,
          room.temperature ? room.temperature.toString() : '',
          setpont,
        ]);
      });

      console.log(table(data));
    })
    .catch(() => {
      console.error('Failed to connect to system');
    });
}

function roomStatus(id: number): void {
  const client = createClient();

  client.roomStatus(id).then((status) => console.log('room status', status));
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
