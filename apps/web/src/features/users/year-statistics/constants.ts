import { ContentTypeEnum } from '@hikka/client';

import { ChartConfig } from '@/components/ui/chart';

import { YearContentType } from '@/types/year-statistics';

export const YEAR = 2025;

export const MONTHS = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
] as const;

export type Month = (typeof MONTHS)[number];

export const MONTH_LABELS: Record<Month, string> = {
    january: 'Січ',
    february: 'Лют',
    march: 'Бер',
    april: 'Кві',
    may: 'Тра',
    june: 'Чер',
    july: 'Лип',
    august: 'Сер',
    september: 'Вер',
    october: 'Жов',
    november: 'Лис',
    december: 'Гру',
};

export const MONTH_LABELS_FULL: Record<Month, string> = {
    january: 'Січень',
    february: 'Лютий',
    march: 'Березень',
    april: 'Квітень',
    may: 'Травень',
    june: 'Червень',
    july: 'Липень',
    august: 'Серпень',
    september: 'Вересень',
    october: 'Жовтень',
    november: 'Листопад',
    december: 'Грудень',
};

export const CONTENT_COLORS = {
    [ContentTypeEnum.ANIME]: 'hsl(217 91% 60%)',
    [ContentTypeEnum.MANGA]: 'hsl(321 70% 69%)',
    [ContentTypeEnum.NOVEL]: 'hsl(142 71% 45%)',
} as const;

export const CONTENT_CHART_CONFIG: ChartConfig = {
    [ContentTypeEnum.ANIME]: {
        label: 'Аніме',
        color: CONTENT_COLORS[ContentTypeEnum.ANIME],
    },
    [ContentTypeEnum.MANGA]: {
        label: 'Манґа',
        color: CONTENT_COLORS[ContentTypeEnum.MANGA],
    },
    [ContentTypeEnum.NOVEL]: {
        label: 'Ранобе',
        color: CONTENT_COLORS[ContentTypeEnum.NOVEL],
    },
};

export const CONTENT_TYPE_LABELS: Record<YearContentType, string> = {
    [ContentTypeEnum.ANIME]: 'Аніме',
    [ContentTypeEnum.MANGA]: 'Манґа',
    [ContentTypeEnum.NOVEL]: 'Ранобе',
};

export const STATUS_LABELS = {
    completed: 'Завершено',
    planned: 'Заплановано',
    dropped: 'Закинуто',
} as const;

export const TOP_BINGES_LIMIT = 5;

export const BINGE_RANK_COLORS = {
    1: 'hsl(38 92% 50%)',
    2: 'hsl(215 14% 64%)',
    3: 'hsl(25 75% 47%)',
    default: CONTENT_COLORS.manga,
} as const;

export const getBingeRankColor = (rank: number): string => {
    return (
        BINGE_RANK_COLORS[rank as keyof typeof BINGE_RANK_COLORS] ??
        BINGE_RANK_COLORS.default
    );
};
