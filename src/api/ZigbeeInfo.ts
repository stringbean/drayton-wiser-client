export default interface ZigbeeInfo {
  Error72Reset: number;
  JPANCount: number;
  NetworkChannel: number;
  NoSignalReset: number;
  UpdateEBLState: string;
  CurrentEBLFile: string;
  TargetEBLFile: string;
  UpdateAttempts: number;
  ZigbeeModuleVersion: string;
  ZigbeeEUI: string;
}
