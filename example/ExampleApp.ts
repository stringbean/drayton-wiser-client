import WiserClient from '../src/WiserClient';
import { table } from 'table';
import chalk from 'chalk';
import { program } from 'commander';

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
