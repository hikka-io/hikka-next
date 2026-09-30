import type { QueryClient } from '@tanstack/react-query';
import { notFound } from '@tanstack/react-router';

import {
    type AnimeInfoResponse,
    animeCharactersInfiniteOptions,
    animeStaffInfiniteOptions,
    type CharacterInfoResponse,
    type Client,
    ContentTypeEnum,
    characterAnimeInfiniteOptions,
    characterMangaInfiniteOptions,
    characterNovelInfiniteOptions,
    characterVoicesInfiniteOptions,
    contentFranchiseOptions,
    type FavouriteContentTypeEnum,
    getArticlesInfiniteOptions,
    getCollectionsInfiniteOptions,
    getCommentsListInfiniteOptions,
    getFavouriteOptions,
    getReadFollowingInfiniteOptions,
    getWatchFollowingInfiniteOptions,
    type MainContentTypeEnum,
    type MangaInfoResponse,
    mangaCharactersInfiniteOptions,
    type NovelInfoResponse,
    novelCharactersInfiniteOptions,
    type PersonInfoResponse,
    paginationPageParam,
    personAnimeInfiniteOptions,
    personMangaInfiniteOptions,
    personNovelInfiniteOptions,
    personVoicesInfiniteOptions,
    ReadContentTypeEnum,
} from '@hikka/api';

import { commentListPrefetchBody } from '@/features/comments/queries';
import {
    type ContentInfo,
    contentInfoOptions,
    listEntryOptions,
} from '@/utils/api/content-queries';
import { ensureOr404 } from '@/utils/api/ensure-or-404';
import { stripRestrictedExternal } from '@/utils/api/strip-restricted-external';
import { getSessionFromPagesCache } from '@/utils/auth';
import { contentPath } from '@/utils/content-paths';
import { getNsfwConsentFn } from '@/utils/cookies';
import { parseTextFromMarkDown } from '@/utils/markdown';
import { generateHeadMeta } from '@/utils/metadata';
import { truncateText } from '@/utils/text';
import { getTitle } from '@/utils/title/get-title';
import { getPublicSiteUrl, SITE_ORIGIN } from '@/utils/url';

type DetailLoaderContext = {
    slug: string;
    queryClient: QueryClient;
    apiClient: Client;
};

type Prefetch = (ctx: DetailLoaderContext) => Promise<unknown>;

// Characters: match the component-body call (no `query`) to share a cache key.
const animeCharacters: Prefetch = ({ slug, queryClient, apiClient }) =>
    queryClient.ensureInfiniteQueryData({
        ...animeCharactersInfiniteOptions({
            path: { slug },
            client: apiClient,
        }),
        ...paginationPageParam(),
    });

const mangaCharacters: Prefetch = ({ slug, queryClient, apiClient }) =>
    queryClient.ensureInfiniteQueryData({
        ...mangaCharactersInfiniteOptions({
            path: { slug },
            client: apiClient,
        }),
        ...paginationPageParam(),
    });

const novelCharacters: Prefetch = ({ slug, queryClient, apiClient }) =>
    queryClient.ensureInfiniteQueryData({
        ...novelCharactersInfiniteOptions({
            path: { slug },
            client: apiClient,
        }),
        ...paginationPageParam(),
    });

const animeStaff: Prefetch = ({ slug, queryClient, apiClient }) =>
    queryClient.ensureInfiniteQueryData({
        ...animeStaffInfiniteOptions({ path: { slug }, client: apiClient }),
        ...paginationPageParam(),
    });

const characterAnime: Prefetch = ({ slug, queryClient, apiClient }) =>
    queryClient.ensureInfiniteQueryData({
        ...characterAnimeInfiniteOptions({ path: { slug }, client: apiClient }),
        ...paginationPageParam(),
    });

const characterManga: Prefetch = ({ slug, queryClient, apiClient }) =>
    queryClient.ensureInfiniteQueryData({
        ...characterMangaInfiniteOptions({ path: { slug }, client: apiClient }),
        ...paginationPageParam(),
    });

const characterNovel: Prefetch = ({ slug, queryClient, apiClient }) =>
    queryClient.ensureInfiniteQueryData({
        ...characterNovelInfiniteOptions({ path: { slug }, client: apiClient }),
        ...paginationPageParam(),
    });

const characterVoices: Prefetch = ({ slug, queryClient, apiClient }) =>
    queryClient.ensureInfiniteQueryData({
        ...characterVoicesInfiniteOptions({
            path: { slug },
            client: apiClient,
        }),
        ...paginationPageParam(),
    });

const personAnime: Prefetch = ({ slug, queryClient, apiClient }) =>
    queryClient.ensureInfiniteQueryData({
        ...personAnimeInfiniteOptions({ path: { slug }, client: apiClient }),
        ...paginationPageParam(),
    });

const personManga: Prefetch = ({ slug, queryClient, apiClient }) =>
    queryClient.ensureInfiniteQueryData({
        ...personMangaInfiniteOptions({ path: { slug }, client: apiClient }),
        ...paginationPageParam(),
    });

const personNovel: Prefetch = ({ slug, queryClient, apiClient }) =>
    queryClient.ensureInfiniteQueryData({
        ...personNovelInfiniteOptions({ path: { slug }, client: apiClient }),
        ...paginationPageParam(),
    });

const personVoices: Prefetch = ({ slug, queryClient, apiClient }) =>
    queryClient.ensureInfiniteQueryData({
        ...personVoicesInfiniteOptions({ path: { slug }, client: apiClient }),
        ...paginationPageParam(),
    });

const franchise =
    (content_type: MainContentTypeEnum): Prefetch =>
    ({ slug, queryClient, apiClient }) =>
        queryClient.ensureQueryData(
            contentFranchiseOptions({
                path: { slug, content_type },
                client: apiClient,
            }),
        );

const articles =
    (content_type: MainContentTypeEnum): Prefetch =>
    ({ slug, queryClient, apiClient }) =>
        queryClient.ensureInfiniteQueryData({
            ...getArticlesInfiniteOptions({
                body: { content_slug: slug, content_type },
                client: apiClient,
            }),
            ...paginationPageParam(),
        });

const comments =
    (content_type: MainContentTypeEnum): Prefetch =>
    ({ slug, queryClient, apiClient }) =>
        queryClient.ensureInfiniteQueryData({
            ...getCommentsListInfiniteOptions({
                path: { content_type, slug },
                body: commentListPrefetchBody(),
                query: { size: 3 },
                client: apiClient,
            }),
            ...paginationPageParam(),
        });

const collections =
    (content_type: MainContentTypeEnum): Prefetch =>
    ({ slug, queryClient, apiClient }) =>
        queryClient.ensureInfiniteQueryData({
            ...getCollectionsInfiniteOptions({
                body: { content: [slug], content_type },
                client: apiClient,
            }),
            ...paginationPageParam(),
        });

const listEntry =
    (type: MainContentTypeEnum): Prefetch =>
    ({ slug, queryClient, apiClient }) =>
        queryClient.ensureQueryData(listEntryOptions(type, slug, apiClient));

const favourite =
    (content_type: FavouriteContentTypeEnum): Prefetch =>
    ({ slug, queryClient, apiClient }) =>
        queryClient.ensureQueryData(
            getFavouriteOptions({
                path: { slug, content_type },
                client: apiClient,
            }),
        );

const watchFollowing: Prefetch = ({ slug, queryClient, apiClient }) =>
    queryClient.ensureInfiniteQueryData({
        ...getWatchFollowingInfiniteOptions({
            path: { slug },
            client: apiClient,
        }),
        ...paginationPageParam(),
    });

const readFollowing =
    (content_type: ReadContentTypeEnum): Prefetch =>
    ({ slug, queryClient, apiClient }) =>
        queryClient.ensureInfiniteQueryData({
            ...getReadFollowingInfiniteOptions({
                path: { slug, content_type },
                client: apiClient,
            }),
            ...paginationPageParam(),
        });

const CONTENT_DETAIL_PREFETCHES = {
    [ContentTypeEnum.ANIME]: {
        prefetches: [
            franchise(ContentTypeEnum.ANIME),
            animeStaff,
            articles(ContentTypeEnum.ANIME),
            comments(ContentTypeEnum.ANIME),
            animeCharacters,
            collections(ContentTypeEnum.ANIME),
        ],
        userPrefetches: [
            listEntry(ContentTypeEnum.ANIME),
            favourite(ContentTypeEnum.ANIME),
            watchFollowing,
        ],
    },
    [ContentTypeEnum.MANGA]: {
        prefetches: [
            mangaCharacters,
            franchise(ContentTypeEnum.MANGA),
            articles(ContentTypeEnum.MANGA),
            comments(ContentTypeEnum.MANGA),
            collections(ContentTypeEnum.MANGA),
        ],
        userPrefetches: [
            listEntry(ContentTypeEnum.MANGA),
            favourite(ContentTypeEnum.MANGA),
            readFollowing(ReadContentTypeEnum.MANGA),
        ],
    },
    [ContentTypeEnum.NOVEL]: {
        prefetches: [
            novelCharacters,
            franchise(ContentTypeEnum.NOVEL),
            articles(ContentTypeEnum.NOVEL),
            comments(ContentTypeEnum.NOVEL),
            collections(ContentTypeEnum.NOVEL),
        ],
        userPrefetches: [
            listEntry(ContentTypeEnum.NOVEL),
            favourite(ContentTypeEnum.NOVEL),
            readFollowing(ReadContentTypeEnum.NOVEL),
        ],
    },
} satisfies Record<
    MainContentTypeEnum,
    { prefetches: Prefetch[]; userPrefetches: Prefetch[] }
>;

type EntityType =
    | typeof ContentTypeEnum.CHARACTER
    | typeof ContentTypeEnum.PERSON;

const ENTITY_DETAIL_PREFETCHES = {
    [ContentTypeEnum.CHARACTER]: [
        characterAnime,
        characterManga,
        characterNovel,
        characterVoices,
    ],
    [ContentTypeEnum.PERSON]: [
        personAnime,
        personManga,
        personNovel,
        personVoices,
    ],
} satisfies Record<EntityType, Prefetch[]>;

type ContentDetail = AnimeInfoResponse | MangaInfoResponse | NovelInfoResponse;

type EntityDetail = CharacterInfoResponse | PersonInfoResponse;

type ContentDetailData<T extends MainContentTypeEnum> = {
    [K in T]: ContentInfo<K>;
} & { nsfwConsented: boolean };

type EntityDetailData<T extends EntityType> = { [K in T]: ContentInfo<K> };

export async function loadContentDetail<T extends MainContentTypeEnum>(
    type: T,
    ctx: DetailLoaderContext,
): Promise<ContentDetailData<T>> {
    const { slug, queryClient, apiClient } = ctx;
    const options = contentInfoOptions<MainContentTypeEnum>(
        type,
        slug,
        apiClient,
    );
    let content = await ensureOr404(() => queryClient.ensureQueryData(options));

    if (!content) throw notFound();

    const session = getSessionFromPagesCache(queryClient);

    if (!session) {
        content = stripRestrictedExternal(content);
        queryClient.setQueryData(options.queryKey, content);
    }

    const nsfwConsented = content.nsfw ? !!(await getNsfwConsentFn()) : false;

    const { prefetches, userPrefetches } = CONTENT_DETAIL_PREFETCHES[type];

    // Only prefetch user-specific data when authed; anon just 401s.
    await Promise.allSettled(
        [...prefetches, ...(session ? userPrefetches : [])].map((prefetch) =>
            prefetch(ctx),
        ),
    );

    return { [type]: content, nsfwConsented } as ContentDetailData<T>;
}

export async function loadEntityDetail<T extends EntityType>(
    type: T,
    ctx: DetailLoaderContext,
): Promise<EntityDetailData<T>> {
    const { slug, queryClient, apiClient } = ctx;
    const entity = await ensureOr404(() =>
        queryClient.ensureQueryData(
            contentInfoOptions<EntityType>(type, slug, apiClient),
        ),
    );

    if (!entity) throw notFound();

    const prefetches = getSessionFromPagesCache(queryClient)
        ? [...ENTITY_DETAIL_PREFETCHES[type], favourite(type)]
        : ENTITY_DETAIL_PREFETCHES[type];

    await Promise.allSettled(prefetches.map((prefetch) => prefetch(ctx)));

    return { [type]: entity } as EntityDetailData<T>;
}

export function contentDetailTitle(
    type: MainContentTypeEnum,
    content: ContentDetail,
): string {
    const originalTitle =
        type === ContentTypeEnum.ANIME
            ? (content as AnimeInfoResponse).title_ja
            : (content as MangaInfoResponse | NovelInfoResponse).title_original;

    return content.title_ua || content.title_en || originalTitle || '';
}

export function contentDetailHead<T extends MainContentTypeEnum>(
    type: T,
    loaderData: ContentDetailData<T> | undefined,
) {
    const content: ContentDetail | undefined = loaderData?.[type];
    if (!content) return {};

    const startDate = content.start_date
        ? new Date(content.start_date * 1000).getUTCFullYear()
        : null;
    const title =
        contentDetailTitle(type, content) +
        (startDate ? ` (${startDate})` : '');
    const synopsis = truncateText(
        parseTextFromMarkDown(content.synopsis_ua || content.synopsis_en || ''),
        150,
        true,
    );

    return generateHeadMeta({
        title,
        description: synopsis,
        image: `${getPublicSiteUrl()}/api/og/${type}?slug=${content.slug}&v=${content.updated}`,
        imageWidth: 1200,
        imageHeight: 630,
        imageType: 'image/jpeg',
        url: `${SITE_ORIGIN}${contentPath(type, content.slug)}`,
        other: {
            ...(content.mal_id ? { 'mal-id': content.mal_id } : {}),
        },
        robots: { index: !content.nsfw },
    });
}

export function entityDetailHead<T extends EntityType>(
    type: T,
    loaderData: EntityDetailData<T> | undefined,
) {
    const entity: EntityDetail | undefined = loaderData?.[type];
    if (!entity) return {};

    return generateHeadMeta({
        title: getTitle(entity) || '',
        description: entity.description_ua,
        image: entity.image,
        url: `${SITE_ORIGIN}${contentPath(type, entity.slug)}`,
    });
}
