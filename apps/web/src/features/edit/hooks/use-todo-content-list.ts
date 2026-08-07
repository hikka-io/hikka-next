import {
    ContentTypeEnum,
    type GetTodoAnimeListData,
    type GetTodoCharacterListData,
    type GetTodoMangaListData,
    type GetTodoNovelListData,
    type GetTodoPersonListData,
    getTodoAnimeListInfiniteOptions,
    getTodoCharacterListInfiniteOptions,
    getTodoMangaListInfiniteOptions,
    getTodoNovelListInfiniteOptions,
    getTodoPersonListInfiniteOptions,
    paginatedInfiniteOptions,
} from '@hikka/api';

import { useInfiniteList } from '@/utils/api/use-infinite-list';

export type TodoContentType =
    | typeof ContentTypeEnum.ANIME
    | typeof ContentTypeEnum.MANGA
    | typeof ContentTypeEnum.NOVEL
    | typeof ContentTypeEnum.CHARACTER
    | typeof ContentTypeEnum.PERSON;

type TodoContentQueryMap = {
    [ContentTypeEnum.ANIME]: GetTodoAnimeListData['query'];
    [ContentTypeEnum.MANGA]: GetTodoMangaListData['query'];
    [ContentTypeEnum.NOVEL]: GetTodoNovelListData['query'];
    [ContentTypeEnum.CHARACTER]: GetTodoCharacterListData['query'];
    [ContentTypeEnum.PERSON]: GetTodoPersonListData['query'];
};

/**
 * One infinite-list hook for all five `/edit/todo/*` endpoints (anime, manga,
 * novel, characters, people). Each endpoint has its own fixed URL and a
 * slightly different filter query shape, so `contentType` just selects which
 * generated infinite-query options — and matching result — to return.
 */
export function useTodoContentList<T extends TodoContentType>(
    contentType: T,
    query?: TodoContentQueryMap[T],
    page = 1,
) {
    const animeOptions = paginatedInfiniteOptions(
        getTodoAnimeListInfiniteOptions({
            query: query as GetTodoAnimeListData['query'],
        }),
        page,
    );
    const mangaOptions = paginatedInfiniteOptions(
        getTodoMangaListInfiniteOptions({
            query: query as GetTodoMangaListData['query'],
        }),
        page,
    );
    const novelOptions = paginatedInfiniteOptions(
        getTodoNovelListInfiniteOptions({
            query: query as GetTodoNovelListData['query'],
        }),
        page,
    );
    const characterOptions = paginatedInfiniteOptions(
        getTodoCharacterListInfiniteOptions({
            query: query as GetTodoCharacterListData['query'],
        }),
        page,
    );
    const personOptions = paginatedInfiniteOptions(
        getTodoPersonListInfiniteOptions({
            query: query as GetTodoPersonListData['query'],
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
