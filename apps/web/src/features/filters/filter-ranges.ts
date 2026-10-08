export const YEARS: [number, number] = [1965, new Date().getFullYear()];

export const SCORE_RANGE: [number, number] = [1, 10];

export const YEAR_RANGE = {
    MIN: 'min',
    MAX: 'max',
} as const;

export type YEAR_RANGE = (typeof YEAR_RANGE)[keyof typeof YEAR_RANGE];
