import { describe, expect, it } from 'vitest';

import type { UserResponseWithRead, UserResponseWithWatch } from '@hikka/api';

import { followingSummary } from './following';

const USER = {
    reference: 'u1',
    updated: null,
    created: 0,
    description: null,
    username: 'someone',
    links: [],
    cover: null,
    active: false,
    avatar: '',
    role: 'user',
};

const ENTRY = {
    reference: 'e1',
    note: null,
    updated: 0,
    created: 0,
    start_date: null,
    end_date: null,
};

const watcher = (status: string, episodes: number, score = 0) =>
    ({
        ...USER,
        watch: [
            {
                ...ENTRY,
                status,
                episodes,
                score,
                rewatches: 0,
                duration: 0,
            },
        ],
    }) as UserResponseWithWatch;

const reader = (status: string, chapters: number) =>
    ({
        ...USER,
        read: [
            {
                ...ENTRY,
                status,
                chapters,
                volumes: 0,
                rereads: 0,
                score: 0,
            },
        ],
    }) as UserResponseWithRead;

describe('followingSummary', () => {
    it('shows the status, episodes in progress and the score', () => {
        expect(followingSummary(watcher('watching', 5, 8))).toEqual({
            status: 'Дивлюсь',
            progress: '5 еп.',
            score: 8,
        });
    });

    it('shows chapters for readers', () => {
        expect(followingSummary(reader('reading', 40))).toMatchObject({
            status: 'Читаю',
            progress: '40 розд.',
        });
    });

    it('hides the progress of completed, planned and empty entries', () => {
        expect(followingSummary(watcher('completed', 12))?.progress).toBe(null);
        expect(followingSummary(reader('planned', 3))?.progress).toBe(null);
        expect(followingSummary(watcher('dropped', 0))?.progress).toBe(null);
    });

    it('is null without an entry', () => {
        expect(
            followingSummary({ ...USER, watch: [] } as UserResponseWithWatch),
        ).toBe(null);
    });
});
