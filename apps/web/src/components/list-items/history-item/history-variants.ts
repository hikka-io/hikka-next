export type HistoryVariant = 'page' | 'panel' | 'card';

type VariantConfig = {
    mainFactOnly: boolean;
    largeHeading: boolean;
    days: string;
    rows: string;
    poster: string;
};

const MEDIUM_ROWS =
    'gap-(--row-gap) [--poster-h:calc(3rem/0.7)] [--row-gap:1.5rem]';

export const HISTORY_VARIANTS = {
    page: {
        mainFactOnly: false,
        largeHeading: true,
        days: 'gap-10',
        rows: `${MEDIUM_ROWS} md:[--poster-h:calc(3.5rem/0.7)] md:[--row-gap:1.25rem]`,
        poster: 'w-12 md:w-14',
    },
    panel: {
        mainFactOnly: false,
        largeHeading: false,
        days: 'gap-6',
        rows: MEDIUM_ROWS,
        poster: 'w-12',
    },
    card: {
        mainFactOnly: true,
        largeHeading: false,
        days: 'gap-6',
        rows: MEDIUM_ROWS,
        poster: 'w-12',
    },
} as const satisfies Record<HistoryVariant, VariantConfig>;

export const HISTORY_ROW_LINE =
    "relative not-last:before:absolute not-last:before:top-[calc(var(--poster-h)/2+1rem)] not-last:before:bottom-[calc(-1*(var(--row-gap)+var(--poster-h)/2-1rem))] not-last:before:left-[15px] not-last:before:w-0.5 not-last:before:bg-border not-last:before:content-['']";
