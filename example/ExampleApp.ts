import WiserClient from '../src/WiserClient';
import { table } from 'table';
import chalk from 'chalk';
import yargs from 'yargs';

interface Args {
  secret: string;
  address: string;
  id?: number;
}

yargs
  .scriptName('ExampleApp')
  .usage('Drayton Wiser demo app')
  .help()
  .options({
    secret: { type: 'string', demandOption: true },
    address: { type: 'string', demandOption: true },
  })
  .describe('secret', 'Wiser system secret')
  .demandOption('secret', 'System secret is required')
  .nargs('secret', 1)
  .alias('secret', 's')
  .describe('address', 'IP or address of of Wiser system')
  .alias('address', 'a')
  .nargs('address', 1)
  .command(
    'list',
    'List status of all rooms',
    () => {},
    (args) => listRooms(args),
  )
  .command(
    'room <id>',
    'Show status of a room',
    () => {},
    (args) => roomStatus(args),
  )
  .example('$0 room 4', 'Shows the status of room 4').argv;

function listRooms(args: Args): void {
  const client = new WiserClient(args.secret, args.address);

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

function roomStatus(args: Args): void {
  const client = new WiserClient(args.secret, args.address);
  const roomId = args.id;

  client
    .roomStatus(<number>args.id)
    .then((status) => console.log('room status', status));
}
