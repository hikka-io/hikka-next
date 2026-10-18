const COMPACT_NUMBER_FORMAT = new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
});

export const formatCompactNumber = (value: number) =>
    COMPACT_NUMBER_FORMAT.format(value);

const NUMBER_FORMAT = new Intl.NumberFormat('uk');

/** Grouped digits, e.g. `65 536`. */
export const formatNumber = (value: number) => NUMBER_FORMAT.format(value);
