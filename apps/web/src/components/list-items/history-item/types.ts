import type { ReadStatusEnum, WatchStatusEnum } from '@hikka/api';

export type HistoryMedium = 'watch' | 'read';

export type HistoryFactPart = {
    type: 'text' | 'value' | 'status';
    text: string;
};

export type HistoryFact = HistoryFactPart[];

export type HistoryIcon =
    | { kind: 'status'; status: WatchStatusEnum | ReadStatusEnum }
    | {
          kind:
              | 'progress'
              | 'rollback'
              | 'score'
              | 'date'
              | 'updated'
              | 'delete'
              | 'favourite-add'
              | 'favourite-remove'
              | 'import';
      };

export type HistoryEntry = {
    medium: HistoryMedium;
    icon: HistoryIcon;
    facts: HistoryFact[];
};
