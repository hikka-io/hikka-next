import type { SFSymbol } from 'expo-symbols';

import { READ_STATUS, WATCH_STATUS } from '@hikka/core';

import {
    BOOKMARK_FLAG_PATH,
    BOOKMARK_PATH,
    COMPLETED_PATH,
    DROPPED_PATH,
    ON_HOLD_PATH,
    PLANNED_PATH,
    WATCHING_PATH,
} from './status-glyphs';
import type { TrackingKind } from './tracking-body';

type StatusStyle = {
    /** Fill and border of a status-tinted control. */
    surface: string;
    /** Label and glyph colour on that surface. */
    text: string;
};

type StatusConfig = {
    value: string;
    title: string;
    glyph: string;
    symbol: SFSymbol;
};

// Literal classes: Uniwind only compiles class names it finds as written.
const STATUS_STYLES: Record<string, StatusStyle> = {
    planned: {
        surface: 'border-planned-border bg-planned',
        text: 'text-planned-foreground',
    },
    watching: {
        surface: 'border-watching-border bg-watching',
        text: 'text-watching-foreground',
    },
    reading: {
        surface: 'border-reading-border bg-reading',
        text: 'text-reading-foreground',
    },
    completed: {
        surface: 'border-completed-border bg-completed',
        text: 'text-completed-foreground',
    },
    on_hold: {
        surface: 'border-on_hold-border bg-on_hold',
        text: 'text-on_hold-foreground',
    },
    dropped: {
        surface: 'border-dropped-border bg-dropped',
        text: 'text-dropped-foreground',
    },
};

/** Solid status fills for dots and distribution bars. */
export const STATUS_DOT = {
    completed: 'bg-completed-foreground',
    watching: 'bg-watching-foreground',
    reading: 'bg-reading-foreground',
    planned: 'bg-planned-foreground',
    dropped: 'bg-dropped-foreground',
    on_hold: 'bg-on_hold-foreground',
} as const;

const NEUTRAL_STYLE: StatusStyle = {
    surface: 'border-secondary-foreground/20 bg-secondary',
    text: 'text-secondary-foreground',
};

const GLYPHS: Record<TrackingKind, Record<string, string>> = {
    watch: {
        planned: PLANNED_PATH,
        watching: WATCHING_PATH,
        completed: COMPLETED_PATH,
        on_hold: ON_HOLD_PATH,
        dropped: DROPPED_PATH,
    },
    read: {
        planned: PLANNED_PATH,
        completed: COMPLETED_PATH,
        on_hold: BOOKMARK_FLAG_PATH,
        dropped: DROPPED_PATH,
        reading: BOOKMARK_PATH,
    },
};

const SYMBOLS: Record<TrackingKind, Record<string, SFSymbol>> = {
    watch: {
        planned: 'plus.circle',
        watching: 'play.circle',
        completed: 'checkmark.circle',
        on_hold: 'pause.circle',
        dropped: 'xmark.circle',
    },
    read: {
        planned: 'plus.circle',
        completed: 'checkmark.circle',
        on_hold: 'bookmark.slash',
        dropped: 'xmark.circle',
        reading: 'bookmark',
    },
};

const LABELS = { watch: WATCH_STATUS, read: READ_STATUS } as const;

const build = (kind: TrackingKind): StatusConfig[] =>
    Object.entries(LABELS[kind]).map(([value, label]) => ({
        value,
        title: label.title_ua,
        glyph: GLYPHS[kind][value],
        symbol: SYMBOLS[kind][value],
    }));

/** Statuses in the web's order (`Object.keys` of the label maps). */
export const STATUS_OPTIONS: Record<TrackingKind, StatusConfig[]> = {
    watch: build('watch'),
    read: build('read'),
};

export const findStatus = (
    kind: TrackingKind,
    status: string | undefined,
): StatusConfig | undefined =>
    STATUS_OPTIONS[kind].find((option) => option.value === status);

export const statusStyle = (status: string | undefined): StatusStyle =>
    (status && STATUS_STYLES[status]) || NEUTRAL_STYLE;
