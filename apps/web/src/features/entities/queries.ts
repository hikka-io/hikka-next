import {
    type Client,
    ContentTypeEnum,
    characterAnimeInfiniteOptions,
    characterMangaInfiniteOptions,
    characterNovelInfiniteOptions,
    characterVoicesInfiniteOptions,
    personAnimeInfiniteOptions,
    personMangaInfiniteOptions,
    personNovelInfiniteOptions,
    personVoicesInfiniteOptions,
} from '@hikka/api';

export const ENTITY_PREVIEW_SIZE = 4;

const ENTITY_APPEARANCES = {
    [ContentTypeEnum.CHARACTER]: {
        anime: characterAnimeInfiniteOptions,
        manga: characterMangaInfiniteOptions,
        novel: characterNovelInfiniteOptions,
        voices: characterVoicesInfiniteOptions,
    },
    [ContentTypeEnum.PERSON]: {
        anime: personAnimeInfiniteOptions,
        manga: personMangaInfiniteOptions,
        novel: personNovelInfiniteOptions,
        voices: personVoicesInfiniteOptions,
    },
};

type EntityAppearances = typeof ENTITY_APPEARANCES;

export type EntityType = keyof EntityAppearances;

export type EntityAppearanceList = keyof EntityAppearances[EntityType];

export const ENTITY_APPEARANCE_LISTS = [
    'anime',
    'manga',
    'novel',
    'voices',
] as const satisfies readonly EntityAppearanceList[];

type AppearanceBuilder = (options: {
    path: { slug: string };
    query?: { size: number };
    client?: Client;
}) => unknown;

/** The overview previews show the first page at `ENTITY_PREVIEW_SIZE`; the tabs page through the full list. */
export function entityAppearanceOptions<
    T extends EntityType,
    L extends EntityAppearanceList,
>(
    type: T,
    list: L,
    slug: string,
    { preview = false }: { preview?: boolean } = {},
    client?: Client,
): ReturnType<EntityAppearances[T][L]> {
    const build = ENTITY_APPEARANCES[type][list] as AppearanceBuilder;

    return build({
        path: { slug },
        ...(preview ? { query: { size: ENTITY_PREVIEW_SIZE } } : {}),
        client,
    }) as ReturnType<EntityAppearances[T][L]>;
}
