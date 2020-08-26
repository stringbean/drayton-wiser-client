import { OverrideType } from './api/OverrideType';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UpdateRequest {}

export interface OverrideRequest extends UpdateRequest {
  RequestOverride: OverrideRequestBody;
}

export interface OverrideRequestBody {
  Type: OverrideType;
  SetPoint?: number;
}
