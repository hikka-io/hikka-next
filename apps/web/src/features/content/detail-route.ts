import { notFound } from '@tanstack/react-router';

import {
    type AnimeInfoResponse,
    type CharacterInfoResponse,
    ContentTypeEnum,
    type FavouriteContentTypeEnum,
    type MainContentTypeEnum,
    type MangaInfoResponse,
    type NovelInfoResponse,
    type PersonInfoResponse,
} from '@hikka/api';

import {
    type ContentInfo,
    contentInfoOptions,
    favouriteEntryOptions,
    listEntryOptions,
} from '@/utils/api/content-queries';
import { ensureOr404 } from '@/utils/api/ensure-or-404';
import type { LoaderContext } from '@/utils/api/loader-prefetch';
import { cacheWithoutRestrictedExternal } from '@/utils/api/strip-restricted-external';
import { getSessionFromPagesCache } from '@/utils/auth';
import { contentPath } from '@/utils/content-paths';
import { readNsfwConsent } from '@/utils/cookies';
import { parseTextFromMarkDown } from '@/utils/markdown';
import { generateHeadMeta } from '@/utils/metadata';
import { truncateText } from '@/utils/text';
import { getTitle } from '@/utils/title/get-title';
import { getPublicSiteUrl, SITE_ORIGIN } from '@/utils/url';

import {
    animeStaffOptions,
    contentCharactersOptions,
    contentRelatedFranchiseOptions,
} from './queries';

type Prefetch = (slug: string, ctx: LoaderContext) => Promise<void>;

const characters =
    (type: MainContentTypeEnum): Prefetch =>
    (slug, { queryClient, apiClient }) =>
        queryClient.prefetchInfiniteQuery(
            contentCharactersOptions(type, slug, apiClient),
        );

const animeStaff: Prefetch = (slug, { queryClient, apiClient }) =>
    queryClient.prefetchInfiniteQuery(animeStaffOptions(slug, apiClient));

const franchise =
    (content_type: MainContentTypeEnum): Prefetch =>
    (slug, { queryClient, apiClient }) =>
        queryClient.prefetchQuery(
            contentRelatedFranchiseOptions(content_type, slug, apiClient),
        );

const listEntry =
    (type: MainContentTypeEnum): Prefetch =>
    (slug, { queryClient, apiClient }) =>
        queryClient.prefetchQuery(listEntryOptions(type, slug, apiClient));

const favourite =
    (content_type: FavouriteContentTypeEnum): Prefetch =>
    (slug, { queryClient, apiClient }) =>
        queryClient.prefetchQuery(
            favouriteEntryOptions(content_type, slug, apiClient),
        );

type ContentTab = 'characters' | 'staff' | 'franchise';

const CONTENT_TAB_PREFETCHES: Record<
    MainContentTypeEnum,
    Partial<Record<ContentTab, Prefetch>>
> = {
    [ContentTypeEnum.ANIME]: {
        characters: characters(ContentTypeEnum.ANIME),
        staff: animeStaff,
        franchise: franchise(ContentTypeEnum.ANIME),
    },
    [ContentTypeEnum.MANGA]: {
        characters: characters(ContentTypeEnum.MANGA),
        franchise: franchise(ContentTypeEnum.MANGA),
    },
    [ContentTypeEnum.NOVEL]: {
        characters: characters(ContentTypeEnum.NOVEL),
        franchise: franchise(ContentTypeEnum.NOVEL),
    },
};

type ContentDetail = AnimeInfoResponse | MangaInfoResponse | NovelInfoResponse;

type EntityDetail = CharacterInfoResponse | PersonInfoResponse;

type EntityType =
    | typeof ContentTypeEnum.CHARACTER
    | typeof ContentTypeEnum.PERSON;

type ContentDetailData<T extends MainContentTypeEnum> = {
    [K in T]: ContentInfo<K>;
} & { nsfwConsented: boolean };

type EntityDetailData<T extends EntityType> = { [K in T]: ContentInfo<K> };

export async function loadContentDetail<T extends MainContentTypeEnum>(
    type: T,
    slug: string,
    ctx: LoaderContext,
): Promise<ContentDetailData<T>> {
    const { queryClient, apiClient } = ctx;
    const options = contentInfoOptions<MainContentTypeEnum>(
        type,
        slug,
        apiClient,
    );
    const session = getSessionFromPagesCache(queryClient);
    const userValues = session
        ? Promise.all([listEntry(type)(slug, ctx), favourite(type)(slug, ctx)])
        : undefined;

    let content = await ensureOr404(() => queryClient.ensureQueryData(options));

    if (!content) throw notFound();

    if (!session) {
        content = cacheWithoutRestrictedExternal(
            queryClient,
            options.queryKey,
            content,
        );
    }

    const nsfwConsented = content.nsfw ? !!(await readNsfwConsent()) : false;

    await userValues;

    return { [type]: content, nsfwConsented } as ContentDetailData<T>;
}

export async function loadContentOverview(
    type: MainContentTypeEnum,
    slug: string,
    ctx: LoaderContext,
): Promise<void> {
    await characters(type)(slug, ctx);
}

export async function loadContentTab(
    type: MainContentTypeEnum,
    tab: ContentTab,
    slug: string,
    ctx: LoaderContext,
): Promise<void> {
    await CONTENT_TAB_PREFETCHES[type][tab]?.(slug, ctx);
}

export async function loadEntityDetail<T extends EntityType>(
    type: T,
    slug: string,
    ctx: LoaderContext,
): Promise<EntityDetailData<T>> {
    const { queryClient, apiClient } = ctx;
    const userValues = getSessionFromPagesCache(queryClient)
        ? favourite(type)(slug, ctx)
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
