import { hashKey } from '@tanstack/react-query';
import { beforeAll, describe, expect, it } from 'vitest';

import {
    type CollectionContentTypeEnum,
    ContentTypeEnum,
    configureBrowserClient,
    createRequestClient,
    getCollectionsInfiniteOptions,
    getReadFollowingInfiniteOptions,
    getWatchFollowingInfiniteOptions,
    type MainContentTypeEnum,
    type ReadContentTypeEnum,
} from '@hikka/api';

import {
    COLLECTIONS_PREVIEW_SIZE,
    contentCollectionsOptions,
    contentFollowingOptions,
    FOLLOWING_PREVIEW_SIZE,
} from './queries';

const BASE_URL = 'https://api.example.test';
const SLUG = 'some-slug';

const MAIN_TYPES = [
    ContentTypeEnum.ANIME,
    ContentTypeEnum.MANGA,
    ContentTypeEnum.NOVEL,
] as const satisfies readonly MainContentTypeEnum[];

const ssrClient = () =>
    createRequestClient({
        baseUrl: BASE_URL,
        internalBaseUrl: 'http://backend:8000',
        authToken: 'token',
    });

const withoutQuery = (queryKey: readonly unknown[]) => {
    const [{ query: _query, ...rest }] = queryKey as [{ query?: unknown }];
    return rest;
};

beforeAll(() => {
    configureBrowserClient({ baseUrl: BASE_URL });
});

describe.each(MAIN_TYPES)('contentFollowingOptions(%s)', (type) => {
    it.each([true, false])(
        'keys the loader like the component (preview %s)',
        (preview) => {
            expect(
                hashKey(
                    contentFollowingOptions(
                        type,
                        SLUG,
                        { preview },
                        ssrClient(),
                    ).queryKey,
                ),
            ).toBe(
                hashKey(
                    contentFollowingOptions(type, SLUG, { preview }).queryKey,
                ),
            );
        },
    );

    it('keeps the HEAD generated keys', () => {
        const head = (query?: { size: number }) =>
            type === ContentTypeEnum.ANIME
                ? getWatchFollowingInfiniteOptions({
                      path: { slug: SLUG },
                      query,
                  }).queryKey
                : getReadFollowingInfiniteOptions({
                      path: {
                          slug: SLUG,
                          content_type: type as ReadContentTypeEnum,
                      },
                      query,
                  }).queryKey;

        expect(
            contentFollowingOptions(type, SLUG, { preview: true }).queryKey,
        ).toStrictEqual(head({ size: 3 }));
        expect(contentFollowingOptions(type, SLUG).queryKey).toStrictEqual(
            head(),
        );
    });

    it('differs from the modal key only by the preview size', () => {
        const preview = contentFollowingOptions(type, SLUG, {
            preview: true,
        }).queryKey;
        const modal = contentFollowingOptions(type, SLUG).queryKey;

        expect(FOLLOWING_PREVIEW_SIZE).toBe(3);
        expect(withoutQuery(preview)).toStrictEqual(withoutQuery(modal));
        expect(preview[0]).toMatchObject({
            query: { size: FOLLOWING_PREVIEW_SIZE },
        });
        expect(modal[0]).not.toHaveProperty('query');
    });
});

describe.each([
    ContentTypeEnum.ANIME,
    ContentTypeEnum.MANGA,
    ContentTypeEnum.NOVEL,
] as const satisfies readonly CollectionContentTypeEnum[])(
    'contentCollectionsOptions(%s)',
    (type) => {
        const body = { content_type: type, content: [SLUG] };

        it.each([true, false])(
            'keys the loader like the component (preview %s)',
            (preview) => {
                expect(
                    hashKey(
                        contentCollectionsOptions(
                            type,
                            SLUG,
                            { preview },
                            ssrClient(),
                        ).queryKey,
                    ),
                ).toBe(
                    hashKey(
                        contentCollectionsOptions(type, SLUG, { preview })
                            .queryKey,
                    ),
                );
            },
        );

        it('keeps the HEAD preview and modal keys', () => {
            expect(
                contentCollectionsOptions(type, SLUG, { preview: true })
                    .queryKey,
            ).toStrictEqual(
                getCollectionsInfiniteOptions({ body, query: { size: 3 } })
                    .queryKey,
            );
            expect(
                contentCollectionsOptions(type, SLUG).queryKey,
            ).toStrictEqual(getCollectionsInfiniteOptions({ body }).queryKey);
        });

        it('differs from the modal key only by the preview size', () => {
            const preview = contentCollectionsOptions(type, SLUG, {
                preview: true,
            }).queryKey;
            const modal = contentCollectionsOptions(type, SLUG).queryKey;

            expect(COLLECTIONS_PREVIEW_SIZE).toBe(3);
            expect(withoutQuery(preview)).toStrictEqual(withoutQuery(modal));
            expect(preview[0].query).toStrictEqual({
                size: COLLECTIONS_PREVIEW_SIZE,
            });
        });
    },
);
