import type { UiStylesOutput } from '@hikka/api';

import type { UIEffect } from './merge';

export type EventTheme = {
    id: string;
    name: string;
    styles?: UiStylesOutput;
    effects?: UIEffect[];
    startDate: Date;
    endDate: Date;
};

/** Event themes activated within their date ranges. */
export const EVENT_THEMES: EventTheme[] = [];

export function getActiveEventTheme(
    themes: readonly EventTheme[] = EVENT_THEMES,
): EventTheme | null {
    const now = new Date();

    for (const theme of themes) {
        if (now >= theme.startDate && now <= theme.endDate) {
            return theme;
        }
    }

    return null;
}
