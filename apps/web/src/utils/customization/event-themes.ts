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
export const EVENT_THEMES: EventTheme[] = [
    {
        id: 'new-year',
        name: 'New Year',
        effects: ['snowfall'],
        startDate: new Date('2024-12-05'),
        endDate: new Date('2025-01-15'),
    },
];

export function getActiveEventTheme(): EventTheme | null {
    const now = new Date();

    for (const theme of EVENT_THEMES) {
        if (now >= theme.startDate && now <= theme.endDate) {
            return theme;
        }
    }

    return null;
}
