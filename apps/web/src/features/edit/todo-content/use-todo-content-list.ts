import {
    type AnimeAgeRatingEnum,
    type AnimeMediaEnum,
    type AnimeTodoArgs,
    type CharacterTodoArgs,
    type ContentStatusEnum,
    ContentTypeEnum,
    getTodoAnimeListInfiniteOptions,
    getTodoCharacterListInfiniteOptions,
    getTodoMangaListInfiniteOptions,
    getTodoNovelListInfiniteOptions,
    getTodoPersonListInfiniteOptions,
    type MangaMediaEnum,
    type MangaTodoArgs,
    type NovelMediaEnum,
    paginatedInfiniteOptions,
    type SeasonEnum,
} from '@hikka/api';

import { useInfiniteList } from '@/utils/api/use-infinite-list';

import type { TodoFiltersValue } from './todo-filters-value';

export type TodoContentType =
    | typeof ContentTypeEnum.ANIME
    | typeof ContentTypeEnum.MANGA
    | typeof ContentTypeEnum.NOVEL
    | typeof ContentTypeEnum.CHARACTER
    | typeof ContentTypeEnum.PERSON;

type TodoContentListParams = {
    filters: TodoFiltersValue;
    page: number;
    size: number;
    query?: string;
    sort: string[];
};

// The generated todo options put the page param into the body, but the backend pages on ?page=.
function todoPageOptions<TOptions extends { queryKey: readonly unknown[] }>(
    options: TOptions,
    page: number,
): TOptions {
    const paginated = paginatedInfiniteOptions(options, page) as TOptions & {
        queryFn: (context: { pageParam: unknown }) => unknown;
    };
    const { queryFn } = paginated;

    return {
        ...paginated,
        queryFn: (context: { pageParam: number }) =>
            queryFn({
                ...context,
                pageParam: {
                    body: { page: context.pageParam },
                    query: { page: context.pageParam },
                },
            }),
    };
}

function toAnimeTodoArgs(filters: TodoFiltersValue): AnimeTodoArgs {
    return {
        media_type: filters.types as AnimeMediaEnum[] | undefined,
        mal_id: filters.mal_id,
        fields: filters.issues,
        genres: filters.genres,
        studios: filters.studios,
        season: filters.seasons as SeasonEnum[] | undefined,
        status: filters.statuses as ContentStatusEnum[] | undefined,
        rating: filters.ratings as AnimeAgeRatingEnum[] | undefined,
        years: filters.years,
    };
}

function toReadTodoArgs(
    filters: TodoFiltersValue,
): Omit<MangaTodoArgs, 'media_type'> {
    return {
        mal_id: filters.mal_id,
        fields: filters.issues,
        genres: filters.genres,
        magazines: filters.magazines,
        status: filters.statuses as ContentStatusEnum[] | undefined,
        years: filters.years,
    };
}

function toPersonTodoArgs(filters: TodoFiltersValue): CharacterTodoArgs {
    return {
        fields: filters.issues,
        content_type: filters.content_type,
        content_slug: filters.content_slug,
    };
}

/**
 * One infinite-list hook for all five `/edit/todo/*` endpoints (anime, manga,
 * novel, characters, people). Each endpoint has its own fixed URL and a
 * slightly different filter body shape, so `contentType` just selects which
 * generated infinite-query options — and matching result — to return.
 */
export function useTodoContentList(
    contentType: TodoContentType,
    { filters, page, size, query, sort }: TodoContentListParams,
) {
    const shared = { query, sort };

    const animeOptions = todoPageOptions(
        getTodoAnimeListInfiniteOptions({
            body: { ...toAnimeTodoArgs(filters), ...shared },
            query: { size },
        }),
        page,
    );
    const mangaOptions = todoPageOptions(
        getTodoMangaListInfiniteOptions({
            body: {
                ...toReadTodoArgs(filters),
                ...shared,
                media_type: filters.types as MangaMediaEnum[] | undefined,
            },
            query: { size },
        }),
        page,
    );
    const novelOptions = todoPageOptions(
        getTodoNovelListInfiniteOptions({
            body: {
                ...toReadTodoArgs(filters),
                ...shared,
                media_type: filters.types as NovelMediaEnum[] | undefined,
            },
            query: { size },
        }),
        page,
    );
    const characterOptions = todoPageOptions(
        getTodoCharacterListInfiniteOptions({
            body: { ...toPersonTodoArgs(filters), ...shared },
            query: { size },
        }),
        page,
    );
    const personOptions = todoPageOptions(
        getTodoPersonListInfiniteOptions({
            body: { ...toPersonTodoArgs(filters), ...shared },
            query: { size },
        }),
        page,
    );

    const anime = useInfiniteList(animeOptions, {
        enabled: contentType === ContentTypeEnum.ANIME,
    });
    const manga = useInfiniteList(mangaOptions, {
        enabled: contentType === ContentTypeEnum.MANGA,
    });
    const novel = useInfiniteList(novelOptions, {
        enabled: contentType === ContentTypeEnum.NOVEL,
    });
    const characters = useInfiniteList(characterOptions, {
        enabled: contentType === ContentTypeEnum.CHARACTER,
    });
    const people = useInfiniteList(personOptions, {
        enabled: contentType === ContentTypeEnum.PERSON,
    });

    switch (contentType) {
        case ContentTypeEnum.ANIME:
            return { ...anime, queryKey: animeOptions.queryKey };
        case ContentTypeEnum.MANGA:
            return { ...manga, queryKey: mangaOptions.queryKey };
        case ContentTypeEnum.NOVEL:
            return { ...novel, queryKey: novelOptions.queryKey };
        case ContentTypeEnum.CHARACTER:
            return { ...characters, queryKey: characterOptions.queryKey };
        case ContentTypeEnum.PERSON:
            return { ...people, queryKey: personOptions.queryKey };
        default:
            return { ...anime, queryKey: animeOptions.queryKey };
    }
}
