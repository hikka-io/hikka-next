import {
    characterAnimeInfiniteOptions,
    characterInfoOptions,
    characterMangaInfiniteOptions,
    characterNovelInfiniteOptions,
    characterVoicesInfiniteOptions,
    paginationPageParam,
    personAnimeInfiniteOptions,
    personInfoOptions,
    personMangaInfiniteOptions,
    personNovelInfiniteOptions,
    personVoicesInfiniteOptions,
} from '@hikka/api';

export { characterInfoOptions, personInfoOptions };

const APPEARANCE_PAGE_SIZE = 12;

const ENTITY_APPEARANCES = {
    character: {
        anime: characterAnimeInfiniteOptions,
        manga: characterMangaInfiniteOptions,
        novel: characterNovelInfiniteOptions,
        voices: characterVoicesInfiniteOptions,
    },
    person: {
        anime: personAnimeInfiniteOptions,
        manga: personMangaInfiniteOptions,
        novel: personNovelInfiniteOptions,
        voices: personVoicesInfiniteOptions,
    },
};

export type EntityType = keyof typeof ENTITY_APPEARANCES;

export type EntityAppearanceList =
    keyof (typeof ENTITY_APPEARANCES)[EntityType];

type AppearanceBuilder = (options: {
    path: { slug: string };
    query: { size: number };
}) => { queryKey: readonly unknown[] };

// Strips are scrolled to the end, not jumped to a page, so the generated key without a page is enough.
export function entityAppearanceOptions(
    type: EntityType,
    list: EntityAppearanceList,
    slug: string,
) {
    const build = ENTITY_APPEARANCES[type][list] as AppearanceBuilder;

    return {
        ...build({ path: { slug }, query: { size: APPEARANCE_PAGE_SIZE } }),
        ...paginationPageParam(),
    };
}
