const COMPACT_NUMBER_FORMAT = new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
});

const COMPACT_UNITS = [
    [1e9, 'B'],
    [1e6, 'M'],
    [1e3, 'K'],
] as const;

/** `Intl` compact notation by hand, for runtimes that ignore it (Hermes). */
export const formatCompactFallback = (value: number) => {
    for (const [index, [size, suffix]] of COMPACT_UNITS.entries()) {
        if (value < size) continue;
        const scaled = Math.round((value / size) * 10) / 10;
        const larger = COMPACT_UNITS[index - 1];
        if (larger && scaled >= 1000) return `1${larger[1]}`;
        return `${scaled}${suffix}`;
    }
    return String(value);
};

// Hermes reports `notation: 'compact'` in resolvedOptions but formats full numbers.
const HAS_COMPACT_NOTATION = COMPACT_NUMBER_FORMAT.format(1000) === '1K';

export const formatCompactNumber = (value: number) =>
    HAS_COMPACT_NOTATION
        ? COMPACT_NUMBER_FORMAT.format(value)
        : formatCompactFallback(value);

const NUMBER_FORMAT = new Intl.NumberFormat('uk');

/** Grouped digits, e.g. `65 536`. */
export const formatNumber = (value: number) => NUMBER_FORMAT.format(value);
