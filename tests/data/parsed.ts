import { Room } from '../../src';

import * as unparsed from './unparsed';

export const ValidRoom = new Room(unparsed.AutoRoom);
export const InvalidRoom = new Room(unparsed.InvalidRoom);
