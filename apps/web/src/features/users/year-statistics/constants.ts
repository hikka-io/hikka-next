import { ChartConfig } from '@/components/ui/chart';

import { ContentType } from '@/types/year-statistics';

// Month definitions
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

// Month labels (short)
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

// Month labels (full)
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

// Content type colors (HSL values)
export const CONTENT_COLORS = {
    anime: 'hsl(217 91% 60%)',
    manga: 'hsl(321 70% 69%)',
    novel: 'hsl(142 71% 45%)',
} as const;

// Content type chart configuration
export const CONTENT_CHART_CONFIG: ChartConfig = {
    anime: {
        label: 'Аніме',
        color: CONTENT_COLORS.anime,
    },
    manga: {
        label: 'Манґа',
        color: CONTENT_COLORS.manga,
    },
    novel: {
        label: 'Ранобе',
        color: CONTENT_COLORS.novel,
    },
};

// Content type labels (Ukrainian)
export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
    anime: 'Аніме',
    manga: 'Манґа',
    novel: 'Ранобе',
};

// Status labels (Ukrainian)
export const STATUS_LABELS = {
    completed: 'Завершено',
    planned: 'Заплановано',
    dropped: 'Закинуто',
} as const;

// Binge highlights configuration
export const TOP_BINGES_LIMIT = 5;

export const BINGE_RANK_COLORS = {
    1: 'hsl(38 92% 50%)', // Gold
    2: 'hsl(215 14% 64%)', // Silver
    3: 'hsl(25 75% 47%)', // Bronze
    default: CONTENT_COLORS.manga, // Primary pink
} as const;

export const getBingeRankColor = (rank: number): string => {
    return (
        BINGE_RANK_COLORS[rank as keyof typeof BINGE_RANK_COLORS] ??
        BINGE_RANK_COLORS.default
    );
};

