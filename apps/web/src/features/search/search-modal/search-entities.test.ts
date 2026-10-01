import { describe, expect, it } from 'vitest';

import { ContentTypeEnum } from '@hikka/api';

import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

import {
    CONTENT_SEARCH_ENTITIES,
    SEARCH_ENTITIES,
    SEARCH_ENTITY_BY_TYPE,
} from './search-entities';

// The registry is the single source of truth for the modal's types, so these
// pin the invariants the lists rely on but cannot check for themselves.
describe('SEARCH_ENTITIES', () => {
    it('declares every type exactly once', () => {
        const types = SEARCH_ENTITIES.map((entity) => entity.type);
        expect(new Set(types).size).toBe(types.length);
    });

    it('routes every type through the project-wide link map', () => {
        for (const entity of SEARCH_ENTITIES) {
            expect(entity.routePrefix).toBe(CONTENT_TYPE_LINKS[entity.type]);
        }
    });

    it('builds hrefs under the type own prefix', () => {
        expect(
            SEARCH_ENTITY_BY_TYPE[ContentTypeEnum.ANIME].getHref({
                slug: 'frieren-ad4e3e',
            }),
        ).toBe('/anime/frieren-ad4e3e');
        // Collections key on the reference, users on the username.
        expect(
            SEARCH_ENTITY_BY_TYPE[ContentTypeEnum.COLLECTION].getHref({
                reference: 'ab12',
            }),
        ).toBe('/collections/ab12');
        expect(
            SEARCH_ENTITY_BY_TYPE[ContentTypeEnum.USER].getHref({
                username: 'hikka',
            }),
        ).toBe('/u/hikka');
    });

    it('returns no href when the item has no key to link to', () => {
        expect(
            SEARCH_ENTITY_BY_TYPE[ContentTypeEnum.USER].getHref({
                username: null,
            }),
        ).toBeNull();
    });

    it('only offers a catalog where one can take the query', () => {
        // `/characters`, `/people`, `/collections` and `/u` cannot, so their
        // "show everything" footer switches the search type instead.
        const withCatalog = SEARCH_ENTITIES.filter(
            (entity) => entity.hasCatalog,
        ).map((entity) => entity.type);

        expect(withCatalog).toEqual([
            ContentTypeEnum.ANIME,
            ContentTypeEnum.MANGA,
            ContentTypeEnum.NOVEL,
        ]);
    });
});

describe('SEARCH_ENTITY_BY_TYPE', () => {
    it('resolves every declared type', () => {
        for (const entity of SEARCH_ENTITIES) {
            expect(SEARCH_ENTITY_BY_TYPE[entity.type]).toBe(entity);
        }
    });
});

describe('CONTENT_SEARCH_ENTITIES', () => {
    it('is everything but the user list', () => {
        expect(CONTENT_SEARCH_ENTITIES.map((entity) => entity.type)).toEqual(
            SEARCH_ENTITIES.map((entity) => entity.type).filter(
                (type) => type !== ContentTypeEnum.USER,
            ),
        );
    });

    it('carries infinite options, which the `Усе` tab needs', () => {
        // Users are the one entry without them: `/user/list` is unpaginated.
        for (const entity of CONTENT_SEARCH_ENTITIES) {
            expect(entity.options).toBeTypeOf('function');
        }

        expect(
            SEARCH_ENTITY_BY_TYPE[ContentTypeEnum.USER].options,
        ).toBeUndefined();
    });
});
