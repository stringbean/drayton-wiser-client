import { UpdateRequest } from './UpdateRequest';

export interface SystemOverrideRequest extends UpdateRequest {
  RequestOverride: SystemOverrideRequestBody;
}

export interface SystemOverrideRequestBody {
  Type: SystemOverrideType;
}

export enum SystemOverrideType {
  Normal = 0,
  Away = 2,
  BoostAllRooms = 4,
  CancelAllOverrides = 5,
}
