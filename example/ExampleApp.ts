import WiserClient from '../src/WiserClient';
import { table } from 'table';
import chalk from 'chalk';

if (process.argv.length < 4) {
  process.exit(1);
}

const secret = process.argv[2];
const ip = process.argv[3];

const client = new WiserClient(secret, ip);

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
