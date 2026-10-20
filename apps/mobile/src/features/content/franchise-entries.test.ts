import { describe, expect, it } from 'vitest';

import type { FranchiseResponse } from '@hikka/api';

import { getFranchiseEntries } from './franchise-entries';

const entry = (
    data_type: 'anime' | 'manga' | 'novel',
    slug: string,
    start_date: number | null,
    year: number | null,
) => ({ data_type, slug, start_date, year }) as never;

describe('getFranchiseEntries', () => {
    it('drops the current title and orders by start date, then year, undated last', () => {
        const franchise = {
            relations: [],
            anime: [
                entry('anime', 'current', 300, 1990),
                entry('anime', 'sequel', Date.UTC(2005, 3) / 1000, 2005),
            ],
            manga: [entry('manga', 'source', null, 1995)],
            novel: [entry('novel', 'undated', null, null)],
        } as FranchiseResponse;

        expect(
            getFranchiseEntries(franchise, 'current').map((e) => e.slug),
        ).toEqual(['source', 'sequel', 'undated']);
    });
});
