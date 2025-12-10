/**
 * Event themes that can be activated based on date ranges.
 */
export const EVENT_THEMES: Hikka.EventTheme[] = [
    {
        id: 'new-year',
        name: 'New Year',
        effects: ['snowfall'],
        startDate: new Date('2024-12-05'),
        endDate: new Date('2025-01-15'),
    },
];

/**
 * Get the currently active event theme based on the current date.
 * Returns null if no event theme is active.
 */
export function getActiveEventTheme(): Hikka.EventTheme | null {
    const now = new Date();

    for (const theme of EVENT_THEMES) {
        if (now >= theme.startDate && now <= theme.endDate) {
            return theme;
        }
    }

    return null;
}

/**
 * Check if a specific effect is active based on event themes.
 */
export function isEventEffectActive(effect: Hikka.UIEffect): boolean {
    const activeTheme = getActiveEventTheme();
    return activeTheme?.effects?.includes(effect) ?? false;
}
