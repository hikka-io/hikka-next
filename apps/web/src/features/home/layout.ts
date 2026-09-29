import type { UiFeedWidget } from '@hikka/api';

import type { UIFeedWidgetSide } from './types';
import { ALL_WIDGET_SLUGS, WIDGET_REGISTRY } from './widgets/registry';

export const COLUMNS: UIFeedWidgetSide[] = ['left', 'center', 'right'];

export function groupBySide(
    widgets: UiFeedWidget[],
): Record<UIFeedWidgetSide, UiFeedWidget[]> {
    const result: Record<UIFeedWidgetSide, UiFeedWidget[]> = {
        left: [],
        center: [],
        right: [],
    };
    for (const w of widgets) {
        result[w.side]?.push(w);
    }
    for (const side of COLUMNS) {
        result[side].sort((a, b) => a.order - b.order);
    }
    return result;
}

export type LayoutPreset =
    | 'left-center-right'
    | 'left-center'
    | 'center-right'
    | 'left-right'
    | 'center-only';

export const PRESET_COLUMNS: Record<LayoutPreset, UIFeedWidgetSide[]> = {
    'left-center-right': ['left', 'center', 'right'],
    'left-center': ['left', 'center'],
    'center-right': ['center', 'right'],
    'left-right': ['left', 'right'],
    'center-only': ['center'],
};

export const PRESET_META: {
    id: LayoutPreset;
    label: string;
    bars: { flex: number; type: 'sidebar' | 'center' }[];
}[] = [
    {
        id: 'left-center-right',
        label: 'Повний макет',
        bars: [
            { flex: 1, type: 'sidebar' },
            { flex: 2, type: 'center' },
            { flex: 1, type: 'sidebar' },
        ],
    },
    {
        id: 'left-center',
        label: 'Ліва + центр',
        bars: [
            { flex: 1.4, type: 'sidebar' },
            { flex: 2, type: 'center' },
        ],
    },
    {
        id: 'center-right',
        label: 'Центр + права',
        bars: [
            { flex: 2, type: 'center' },
            { flex: 1.4, type: 'sidebar' },
        ],
    },
    {
        id: 'left-right',
        label: 'Дві колонки',
        bars: [
            { flex: 1, type: 'sidebar' },
            { flex: 1, type: 'sidebar' },
        ],
    },
    {
        id: 'center-only',
        label: 'Одна колонка',
        bars: [{ flex: 1, type: 'center' }],
    },
];

export function derivePreset(widgets: UiFeedWidget[]): LayoutPreset {
    const sides = new Set(widgets.map((w) => w.side));
    const hasLeft = sides.has('left');
    const hasCenter = sides.has('center');
    const hasRight = sides.has('right');

    if (hasLeft && hasCenter && hasRight) return 'left-center-right';
    if (hasLeft && hasCenter) return 'left-center';
    if (hasCenter && hasRight) return 'center-right';
    if (hasLeft && hasRight) return 'left-right';
    return 'center-only';
}

const SIDE_FALLBACK: Record<UIFeedWidgetSide, UIFeedWidgetSide[]> = {
    left: ['right', 'center'],
    center: ['right', 'left'],
    right: ['center', 'left'],
};

export function resolveSide(
    defaultSide: UIFeedWidgetSide,
    activeSides: UIFeedWidgetSide[],
): UIFeedWidgetSide {
    if (activeSides.includes(defaultSide)) return defaultSide;
    return (
        SIDE_FALLBACK[defaultSide].find((s) => activeSides.includes(s)) ??
        activeSides[0]
    );
}

export function buildPresetWidgets(preset: LayoutPreset): UiFeedWidget[] {
    const activeSides = PRESET_COLUMNS[preset];
    return ALL_WIDGET_SLUGS.map((slug) => ({
        slug,
        side: resolveSide(WIDGET_REGISTRY[slug].defaultSide, activeSides),
        order: 0,
    }));
}

export function reindex(widgets: UiFeedWidget[]): UiFeedWidget[] {
    const grouped: Record<UIFeedWidgetSide, UiFeedWidget[]> = {
        left: [],
        center: [],
        right: [],
    };
    for (const w of widgets) {
        grouped[w.side]?.push(w);
    }
    return COLUMNS.flatMap((side) =>
        grouped[side].map((w, i) => ({ ...w, order: i + 1 })),
    );
}
