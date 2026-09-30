import type { QueryClient } from '@tanstack/react-query';
import { notFound } from '@tanstack/react-router';

import {
    type AnimeInfoResponse,
    animeCharactersInfiniteOptions,
    animeStaffInfiniteOptions,
    type CharacterInfoResponse,
    type Client,
    ContentTypeEnum,
    contentFranchiseOptions,
    type FavouriteContentTypeEnum,
    type MainContentTypeEnum,
    type MangaInfoResponse,
    mangaCharactersInfiniteOptions,
    type NovelInfoResponse,
    novelCharactersInfiniteOptions,
    type PersonInfoResponse,
    paginationPageParam,
} from '@hikka/api';

import {
    ENTITY_APPEARANCE_LISTS,
    type EntityAppearanceList,
    type EntityType,
    entityAppearanceOptions,
} from '@/features/entities/queries';
import {
    type ContentInfo,
    contentInfoOptions,
    favouriteEntryOptions,
    listEntryOptions,
} from '@/utils/api/content-queries';
import { ensureOr404 } from '@/utils/api/ensure-or-404';
import { stripRestrictedExternal } from '@/utils/api/strip-restricted-external';
import { getSessionFromPagesCache } from '@/utils/auth';
import { contentPath } from '@/utils/content-paths';
import { readNsfwConsent } from '@/utils/cookies';
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

// The entity lists differ in page type; a prefetch discards the data, so it only needs the common shape.
type InfinitePrefetchOptions = Parameters<
    QueryClient['ensureInfiniteQueryData']
>[0];

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

const franchise =
    (content_type: MainContentTypeEnum): Prefetch =>
    ({ slug, queryClient, apiClient }) =>
        queryClient.ensureQueryData(
            contentFranchiseOptions({
                path: { slug, content_type },
                client: apiClient,
            }),
        );

const listEntry =
    (type: MainContentTypeEnum): Prefetch =>
    ({ slug, queryClient, apiClient }) =>
        queryClient.ensureQueryData(listEntryOptions(type, slug, apiClient));

const favourite =
    (content_type: FavouriteContentTypeEnum): Prefetch =>
    ({ slug, queryClient, apiClient }) =>
        queryClient.ensureQueryData(
            favouriteEntryOptions(content_type, slug, apiClient),
        );

const CONTENT_CHARACTERS = {
    [ContentTypeEnum.ANIME]: animeCharacters,
    [ContentTypeEnum.MANGA]: mangaCharacters,
    [ContentTypeEnum.NOVEL]: novelCharacters,
} satisfies Record<MainContentTypeEnum, Prefetch>;

type ContentTab = 'characters' | 'staff' | 'franchise';

const CONTENT_TAB_PREFETCHES: Record<
    MainContentTypeEnum,
    Partial<Record<ContentTab, Prefetch>>
> = {
    [ContentTypeEnum.ANIME]: {
        characters: animeCharacters,
        staff: animeStaff,
        franchise: franchise(ContentTypeEnum.ANIME),
    },
    [ContentTypeEnum.MANGA]: {
        characters: mangaCharacters,
        franchise: franchise(ContentTypeEnum.MANGA),
    },
    [ContentTypeEnum.NOVEL]: {
        characters: novelCharacters,
        franchise: franchise(ContentTypeEnum.NOVEL),
    },
};

const settle = (prefetches: Prefetch[], ctx: DetailLoaderContext) =>
    Promise.allSettled(prefetches.map((prefetch) => prefetch(ctx)));

const entityAppearance =
    (
        type: EntityType,
        list: EntityAppearanceList,
        preview: boolean,
    ): Prefetch =>
    ({ slug, queryClient, apiClient }) =>
        queryClient.ensureInfiniteQueryData({
            ...entityAppearanceOptions(
                type,
                list,
                slug,
                { preview },
                apiClient,
            ),
            ...paginationPageParam(),
        } as InfinitePrefetchOptions);

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
    const session = getSessionFromPagesCache(queryClient);
    const userValues = session
        ? settle([listEntry(type), favourite(type)], ctx)
        : undefined;

    let content = await ensureOr404(() => queryClient.ensureQueryData(options));

    if (!content) throw notFound();

    if (!session) {
        content = stripRestrictedExternal(content);
        queryClient.setQueryData(options.queryKey, content);
    }

    const nsfwConsented = content.nsfw ? !!(await readNsfwConsent()) : false;

    await userValues;

    return { [type]: content, nsfwConsented } as ContentDetailData<T>;
}

export async function loadContentOverview(
    type: MainContentTypeEnum,
    ctx: DetailLoaderContext,
): Promise<void> {
    await settle([CONTENT_CHARACTERS[type]], ctx);
}

export async function loadContentTab(
    type: MainContentTypeEnum,
    tab: ContentTab,
    ctx: DetailLoaderContext,
): Promise<void> {
    const prefetch = CONTENT_TAB_PREFETCHES[type][tab];

    if (prefetch) await settle([prefetch], ctx);
}

export async function loadEntityDetail<T extends EntityType>(
    type: T,
    ctx: DetailLoaderContext,
): Promise<EntityDetailData<T>> {
    const { slug, queryClient, apiClient } = ctx;
    const userValues = getSessionFromPagesCache(queryClient)
        ? settle([favourite(type)], ctx)
        : undefined;

    const entity = await ensureOr404(() =>
        queryClient.ensureQueryData(
            contentInfoOptions<EntityType>(type, slug, apiClient),
        ),
    );

    if (!entity) throw notFound();

    await userValues;

    return { [type]: entity } as EntityDetailData<T>;
}

export async function loadEntityOverview(
    type: EntityType,
    ctx: DetailLoaderContext,
): Promise<void> {
    await settle(
        ENTITY_APPEARANCE_LISTS.map((list) =>
            entityAppearance(type, list, true),
        ),
        ctx,
    );
}

export async function loadEntityTab(
    type: EntityType,
    list: EntityAppearanceList,
    ctx: DetailLoaderContext,
): Promise<void> {
    await settle([entityAppearance(type, list, false)], ctx);
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
