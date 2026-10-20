import { describe, expect, it } from 'vitest';

import {
    MainContentTypeEnum,
    ReadStatusEnum,
    WatchStatusEnum,
} from '@hikka/api';

import { buildCatalogSearchArgs, listStatuses } from './catalog-search-args';

describe('listStatuses', () => {
    it('lists every watch status for anime and every read status otherwise', () => {
        expect(listStatuses(MainContentTypeEnum.ANIME)).toEqual(
            Object.values(WatchStatusEnum),
        );
        expect(listStatuses(MainContentTypeEnum.NOVEL)).toEqual(
            Object.values(ReadStatusEnum),
        );
    });
});

describe('buildCatalogSearchArgs', () => {
    it('adds the hidden statuses to the type-specific exclude field', () => {
        const anime = buildCatalogSearchArgs(MainContentTypeEnum.ANIME, {}, [
            'completed',
        ]);
        const manga = buildCatalogSearchArgs(MainContentTypeEnum.MANGA, {}, [
            'reading',
        ]);

        expect(anime.args.exclude_watch_status).toEqual(['completed']);
        expect(manga.args.exclude_read_status).toEqual(['reading']);
    });

    it('leaves the exclude fields out without hidden statuses', () => {
        const { args, page } = buildCatalogSearchArgs(
            MainContentTypeEnum.NOVEL,
            { page: 3 },
        );

        expect(args).not.toHaveProperty('exclude_read_status');
        expect(page).toBe(3);
    });

    it('drops anime-only params for manga and novel', () => {
        const { args } = buildCatalogSearchArgs(MainContentTypeEnum.MANGA, {
            seasons: ['fall'],
            studios: ['madhouse'],
        });

        expect(args).not.toHaveProperty('season');
        expect(args).not.toHaveProperty('studios');
    });
});
