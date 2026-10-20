import { describe, expect, it } from 'vitest';

import {
    buildUserReadListArgs,
    buildUserWatchListArgs,
    randomListStatus,
} from './user-list-args';

describe('buildUserWatchListArgs', () => {
    it('sends the status, the default sort and empty filters', () => {
        expect(buildUserWatchListArgs({ status: 'planned' })).toEqual({
            watch_status: 'planned',
            media_type: [],
            status: [],
            season: [],
            rating: [],
            years: [],
            genres: [],
            studios: [],
            score: undefined,
            sort: ['watch_score:desc'],
        });
    });

    it('drops the status for the whole list', () => {
        expect(buildUserWatchListArgs({ status: 'all' }).watch_status).toBe(
            undefined,
        );
    });

    it('leaves the status out when there is none', () => {
        expect(buildUserWatchListArgs({}).watch_status).toBe(undefined);
    });

    it('sends the translated filter only when it is on', () => {
        expect(buildUserWatchListArgs({})).not.toHaveProperty(
            'only_translated',
        );
        expect(
            buildUserWatchListArgs({ only_translated: true }).only_translated,
        ).toBe(true);
    });

    it('expands secondary sort fields', () => {
        expect(
            buildUserWatchListArgs({ sort: 'score', order: 'asc' }).sort,
        ).toEqual(['score:asc', 'scored_by:asc']);
    });
});

describe('buildUserReadListArgs', () => {
    it('sends the read status and the read sort', () => {
        const args = buildUserReadListArgs({
            status: 'reading',
            sort: 'read_chapters',
            order: 'desc',
        });

        expect(args.read_status).toBe('reading');
        expect(args.sort).toEqual(['read_chapters:desc']);
        expect(args.magazines).toEqual([]);
    });

    it('sends the translated filter only when it is on', () => {
        expect(buildUserReadListArgs({})).not.toHaveProperty('only_translated');
        expect(
            buildUserReadListArgs({ only_translated: true }).only_translated,
        ).toBe(true);
    });

    it('drops the status for the whole list', () => {
        expect(buildUserReadListArgs({ status: 'all' }).read_status).toBe(
            undefined,
        );
    });

    it('leaves the status out when there is none', () => {
        expect(buildUserReadListArgs({}).read_status).toBe(undefined);
    });
});

describe('randomListStatus', () => {
    const statuses = ['completed', 'planned', 'dropped'] as const;
    const counts = { completed: 6, planned: 3, dropped: 1 };

    it('keeps a concrete status', () => {
        expect(randomListStatus('planned', counts, statuses)).toBe('planned');
    });

    it('picks a status in proportion to its entries for the whole list', () => {
        expect(randomListStatus('all', counts, statuses, () => 0)).toBe(
            'completed',
        );
        expect(randomListStatus('all', counts, statuses, () => 0.65)).toBe(
            'planned',
        );
        expect(randomListStatus('all', counts, statuses, () => 0.95)).toBe(
            'dropped',
        );
    });

    it('skips empty statuses and gives up on an empty list', () => {
        expect(
            randomListStatus('all', { dropped: 2 }, statuses, () => 0.999),
        ).toBe('dropped');
        expect(randomListStatus('all', {}, statuses)).toBeUndefined();
    });
});
