import { UpdateRequest } from './UpdateRequest';
import { OverrideType } from '../OverrideType';

export interface OverrideRequest extends UpdateRequest {
  RequestOverride: OverrideRequestBody;
}

export interface OverrideRequestBody {
  Type: OverrideType;
  SetPoint?: number;
}
