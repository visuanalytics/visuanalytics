export type DeleteSchedule =
  | NoDeletionSchedule
  | OnDayHourSchedule
  | KeepCountSchedule
  | FixNamesSchedule;

interface NoDeletionSchedule {
  type: "noDeletion";
}

interface OnDayHourSchedule {
  type: "onDayHour";
  removalTime: DayHour;
}

interface KeepCountSchedule {
  type: "keepCount";
  keepCount: number;
}

interface FixNamesSchedule {
  type: "fixNames";
  count: number;
}

export interface DayHour {
  days: number;
  hours: number;
}
