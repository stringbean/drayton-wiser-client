export default interface Schedule {
  id: number;
  Monday: ScheduleDay;
  Tuesday: ScheduleDay;
  Wednesday: ScheduleDay;
  Thursday: ScheduleDay;
  Friday: ScheduleDay;
  Saturday: ScheduleDay;
  Sunday: ScheduleDay;
  Type: string;
}

export interface ScheduleDay {
  SetPoints: SetPoint[];
}

export interface SetPoint {
  Time: number;
  DegreesC: number;
}
