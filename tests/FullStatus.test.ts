import * as unparsed from './data/unparsed';
import * as parsed from './data/parsed';
import { FullStatus } from '../src';
import { ProductType } from '../src/api/ProductType';

test('new FullStatus parses full system status', () => {
  const status = new FullStatus(unparsed.FullSystemStatus);

  expect(status.system).toEqual(parsed.NormalSystemStatus);

  expect(status.devices).toHaveLength(6);
  expect(status.devices[0].id).toEqual(0);
  expect(status.devices[0].productType).toEqual(ProductType.HeatHub);

  expect(status.rooms).toHaveLength(6);
  expect(status.rooms[0].id).toEqual(1);
  expect(status.rooms[0].name).toEqual('Hall');
});
