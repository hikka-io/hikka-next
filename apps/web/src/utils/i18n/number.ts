const COMPACT_NUMBER_FORMAT = new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
});

export const formatCompactNumber = (value: number) =>
    COMPACT_NUMBER_FORMAT.format(value);
