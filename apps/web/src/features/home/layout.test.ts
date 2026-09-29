import { arrayMove } from '@dnd-kit/sortable';
import { describe, expect, it } from 'vitest';

import type { UiFeedWidget } from '@hikka/api';

import {
    buildPresetWidgets,
    COLUMNS,
    derivePreset,
    groupBySide,
    type LayoutPreset,
    PRESET_COLUMNS,
    PRESET_META,
    reindex,
    resolveSide,
} from './layout';

const FEED: UiFeedWidget[] = [
    { slug: 'feed', side: 'center', order: 1 },
    { slug: 'tracker', side: 'left', order: 2 },
    { slug: 'schedule', side: 'right', order: 1 },
    { slug: 'profile', side: 'left', order: 1 },
    { slug: 'ongoings', side: 'center', order: 2 },
    { slug: 'history', side: 'left', order: 3 },
    { slug: 'list', side: 'right', order: 2 },
];

const OFF_GRID = {
    slug: 'articles',
    side: 'top',
    order: 1,
} as unknown as UiFeedWidget;

const PRESETS: LayoutPreset[] = [
    'left-center-right',
    'left-center',
    'center-right',
    'left-right',
    'center-only',
];

describe('presets', () => {
    it('lists the preset columns and thumbnails in selector order', () => {
        expect(PRESET_COLUMNS).toEqual({
            'left-center-right': ['left', 'center', 'right'],
            'left-center': ['left', 'center'],
            'center-right': ['center', 'right'],
            'left-right': ['left', 'right'],
            'center-only': ['center'],
        });
        expect(PRESET_META.map((preset) => preset.id)).toEqual(PRESETS);
        expect(PRESET_META.map((preset) => preset.bars.length)).toEqual([
            3, 2, 2, 2, 1,
        ]);
    });

    it.each([
        [['left', 'center', 'right'], 'left-center-right'],
        [['left', 'center'], 'left-center'],
        [['center', 'right'], 'center-right'],
        [['left', 'right'], 'left-right'],
        [['center'], 'center-only'],
        [['left'], 'center-only'],
        [['right'], 'center-only'],
        [[], 'center-only'],
    ] as const)('derives the preset from sides %j', (sides, preset) => {
        const widgets = sides.map((side, i) => ({
            slug: 'feed' as const,
            side,
            order: i + 1,
        }));

        expect(derivePreset(widgets)).toBe(preset);
    });

    it.each([
        ['left', ['left', 'center', 'right'], 'left'],
        ['left', ['center', 'right'], 'right'],
        ['left', ['center'], 'center'],
        ['center', ['left', 'right'], 'right'],
        ['center', ['left', 'center'], 'center'],
        ['center', ['left'], 'left'],
        ['right', ['left', 'center'], 'center'],
        ['right', ['left'], 'left'],
        ['right', ['center', 'right'], 'right'],
    ] as const)('resolves %s within %j to %s', (side, active, expected) => {
        expect(resolveSide(side, [...active])).toBe(expected);
    });

    it('resolves to undefined when no column is active', () => {
        expect(resolveSide('center', [])).toBeUndefined();
    });

    it.each([
        [
            'left-center-right',
            [
                'left',
                'right',
                'center',
                'left',
                'left',
                'right',
                'center',
                'right',
                'left',
            ],
        ],
        [
            'left-center',
            [
                'left',
                'center',
                'center',
                'left',
                'left',
                'center',
                'center',
                'center',
                'left',
            ],
        ],
        [
            'center-right',
            [
                'right',
                'right',
                'center',
                'right',
                'right',
                'right',
                'center',
                'right',
                'right',
            ],
        ],
        [
            'left-right',
            [
                'left',
                'right',
                'right',
                'left',
                'left',
                'right',
                'right',
                'right',
                'left',
            ],
        ],
        [
            'center-only',
            [
                'center',
                'center',
                'center',
                'center',
                'center',
                'center',
                'center',
                'center',
                'center',
            ],
        ],
    ] as const)('builds the %s widgets in registry order', (preset, sides) => {
        const widgets = buildPresetWidgets(preset);

        expect(widgets.map((w) => w.slug)).toEqual([
            'profile',
            'list',
            'ongoings',
            'tracker',
            'history',
            'schedule',
            'feed',
            'collections',
            'articles',
        ]);
        expect(widgets.map((w) => w.side)).toEqual(sides);
        expect(widgets.every((w) => w.order === 0)).toBe(true);
        expect(derivePreset(widgets)).toBe(preset);
    });
});

describe('groupBySide', () => {
    it('buckets by side and sorts each column by order', () => {
        expect(COLUMNS).toEqual(['left', 'center', 'right']);
        expect(groupBySide([...FEED, OFF_GRID])).toEqual({
            left: [
                { slug: 'profile', side: 'left', order: 1 },
                { slug: 'tracker', side: 'left', order: 2 },
                { slug: 'history', side: 'left', order: 3 },
            ],
            center: [
                { slug: 'feed', side: 'center', order: 1 },
                { slug: 'ongoings', side: 'center', order: 2 },
            ],
            right: [
                { slug: 'schedule', side: 'right', order: 1 },
                { slug: 'list', side: 'right', order: 2 },
            ],
        });
    });
});

describe('reindex', () => {
    it('numbers each column by array position, ignoring stale orders', () => {
        expect(reindex([...FEED, OFF_GRID])).toEqual([
            { slug: 'tracker', side: 'left', order: 1 },
            { slug: 'profile', side: 'left', order: 2 },
            { slug: 'history', side: 'left', order: 3 },
            { slug: 'feed', side: 'center', order: 1 },
            { slug: 'ongoings', side: 'center', order: 2 },
            { slug: 'schedule', side: 'right', order: 1 },
            { slug: 'list', side: 'right', order: 2 },
        ]);
    });

    it('keeps the order an arrayMove within one column produced', () => {
        const left = groupBySide(FEED).left;
        const others = FEED.filter((w) => w.side !== 'left');

        expect(reindex([...others, ...arrayMove(left, 0, 2)])).toEqual([
            { slug: 'tracker', side: 'left', order: 1 },
            { slug: 'history', side: 'left', order: 2 },
            { slug: 'profile', side: 'left', order: 3 },
            { slug: 'feed', side: 'center', order: 1 },
            { slug: 'ongoings', side: 'center', order: 2 },
            { slug: 'schedule', side: 'right', order: 1 },
            { slug: 'list', side: 'right', order: 2 },
        ]);
    });

    it('places a cross-column move where it was spliced', () => {
        expect(
            reindex([
                { slug: 'tracker', side: 'left', order: 2 },
                { slug: 'profile', side: 'left', order: 1 },
                { slug: 'history', side: 'left', order: 3 },
                { slug: 'schedule', side: 'right', order: 1 },
                { slug: 'list', side: 'center', order: 2 },
                { slug: 'feed', side: 'center', order: 1 },
                { slug: 'ongoings', side: 'center', order: 2 },
            ]),
        ).toEqual([
            { slug: 'tracker', side: 'left', order: 1 },
            { slug: 'profile', side: 'left', order: 2 },
            { slug: 'history', side: 'left', order: 3 },
            { slug: 'list', side: 'center', order: 1 },
            { slug: 'feed', side: 'center', order: 2 },
            { slug: 'ongoings', side: 'center', order: 3 },
            { slug: 'schedule', side: 'right', order: 1 },
        ]);
    });

    it('appends an added widget with order 0 to the end of its column', () => {
        const current = reindex(FEED);

        expect(
            reindex([
                ...current,
                { slug: 'collections', side: 'right', order: 0 },
            ]).filter((w) => w.side === 'right'),
        ).toEqual([
            { slug: 'schedule', side: 'right', order: 1 },
            { slug: 'list', side: 'right', order: 2 },
            { slug: 'collections', side: 'right', order: 3 },
        ]);
    });

    it('closes the gap a removed widget leaves', () => {
        expect(
            reindex(reindex(FEED).filter((w) => w.slug !== 'profile')),
        ).toEqual([
            { slug: 'tracker', side: 'left', order: 1 },
            { slug: 'history', side: 'left', order: 2 },
            { slug: 'feed', side: 'center', order: 1 },
            { slug: 'ongoings', side: 'center', order: 2 },
            { slug: 'schedule', side: 'right', order: 1 },
            { slug: 'list', side: 'right', order: 2 },
        ]);
    });

    it('turns preset widgets into per-column orders', () => {
        expect(reindex(buildPresetWidgets('left-center'))).toEqual([
            { slug: 'profile', side: 'left', order: 1 },
            { slug: 'tracker', side: 'left', order: 2 },
            { slug: 'history', side: 'left', order: 3 },
            { slug: 'articles', side: 'left', order: 4 },
            { slug: 'list', side: 'center', order: 1 },
            { slug: 'ongoings', side: 'center', order: 2 },
            { slug: 'schedule', side: 'center', order: 3 },
            { slug: 'feed', side: 'center', order: 4 },
            { slug: 'collections', side: 'center', order: 5 },
        ]);
    });
});
