import { describe, expect, it } from 'vitest';

import {
    buildUserReadListArgs,
    buildUserWatchListArgs,
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

    it('drops the status for the whole list', () => {
        expect(buildUserReadListArgs({ status: 'all' }).read_status).toBe(
            undefined,
        );
    });
});
