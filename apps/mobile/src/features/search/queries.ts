import type {
    InfiniteData,
    UseInfiniteQueryOptions,
} from '@tanstack/react-query';

import {
    type AnimeResponse,
    type CharacterResponse,
    ContentTypeEnum,
    type MangaResponse,
    type NovelResponse,
    type PaginationResponse,
    type PersonResponse,
    paginatedInfiniteOptions,
    searchAnimeInfiniteOptions,
    searchAnimeOptions,
    searchCharactersInfiniteOptions,
    searchCharactersOptions,
    searchMangaInfiniteOptions,
    searchMangaOptions,
    searchNovelInfiniteOptions,
    searchNovelOptions,
    searchPeopleInfiniteOptions,
    searchPeopleOptions,
    searchUsersOptions,
    type UserResponse,
} from '@hikka/api';

import type { SearchType } from './search-scope';

/** The web's single-type page size; the "Усе" scope shows three per type. */
const SEARCH_PAGE_SIZE = 30;
const SEARCH_PREVIEW_SIZE = 3;

export type ContentSearchType = Exclude<
    SearchType,
    typeof ContentTypeEnum.USER
>;

export type SearchItem =
    | AnimeResponse
    | MangaResponse
    | NovelResponse
    | CharacterResponse
    | PersonResponse;

type SearchPage = {
    list: SearchItem[];
    pagination: PaginationResponse;
};

type SearchOptions = UseInfiniteQueryOptions<
    SearchPage,
    Error,
    InfiniteData<SearchPage, number>,
    readonly unknown[],
    number
> & { initialPageParam: number };

export function contentSearchOptions(
    type: ContentSearchType,
    query: string,
    size: number = SEARCH_PAGE_SIZE,
) {
    const options = { query: { size } };

    switch (type) {
        case ContentTypeEnum.ANIME:
            return paginatedInfiniteOptions(
                searchAnimeInfiniteOptions({ ...options, body: { query } }),
            ) as unknown as SearchOptions;
        case ContentTypeEnum.MANGA:
            return paginatedInfiniteOptions(
                searchMangaInfiniteOptions({ ...options, body: { query } }),
            ) as unknown as SearchOptions;
        case ContentTypeEnum.NOVEL:
            return paginatedInfiniteOptions(
                searchNovelInfiniteOptions({ ...options, body: { query } }),
            ) as unknown as SearchOptions;
        case ContentTypeEnum.CHARACTER:
            return paginatedInfiniteOptions(
                searchCharactersInfiniteOptions({
                    ...options,
                    body: { query },
                }),
            ) as unknown as SearchOptions;
        case ContentTypeEnum.PERSON:
            return paginatedInfiniteOptions(
                searchPeopleInfiniteOptions({ ...options, body: { query } }),
            ) as unknown as SearchOptions;
    }
}

/** User search is one unpaged list, as on the web. */
export function userSearchOptions(query: string) {
    return searchUsersOptions({ body: { query } });
}

export type SearchPreview =
    | { type: ContentSearchType; list: SearchItem[] }
    | { type: typeof ContentTypeEnum.USER; list: UserResponse[] };

const PREVIEW_QUERY = { size: SEARCH_PREVIEW_SIZE };

/** The first few results of one type for the "Усе" scope, as one list shape. */
export function searchPreviewOptions(type: SearchType, query: string) {
    const body = { query };

    switch (type) {
        case ContentTypeEnum.ANIME:
            return {
                ...searchAnimeOptions({ body, query: PREVIEW_QUERY }),
                select: (data: { list: SearchItem[] }): SearchPreview => ({
                    type,
                    list: data.list,
                }),
            };
        case ContentTypeEnum.MANGA:
            return {
                ...searchMangaOptions({ body, query: PREVIEW_QUERY }),
                select: (data: { list: SearchItem[] }): SearchPreview => ({
                    type,
                    list: data.list,
                }),
            };
        case ContentTypeEnum.NOVEL:
            return {
                ...searchNovelOptions({ body, query: PREVIEW_QUERY }),
                select: (data: { list: SearchItem[] }): SearchPreview => ({
                    type,
                    list: data.list,
                }),
            };
        case ContentTypeEnum.CHARACTER:
            return {
                ...searchCharactersOptions({ body, query: PREVIEW_QUERY }),
                select: (data: { list: SearchItem[] }): SearchPreview => ({
                    type,
                    list: data.list,
                }),
            };
        case ContentTypeEnum.PERSON:
            return {
                ...searchPeopleOptions({ body, query: PREVIEW_QUERY }),
                select: (data: { list: SearchItem[] }): SearchPreview => ({
                    type,
                    list: data.list,
                }),
            };
        case ContentTypeEnum.USER:
            return {
                ...userSearchOptions(query),
                select: (data: UserResponse[]): SearchPreview => ({
                    type,
                    list: data.slice(0, SEARCH_PREVIEW_SIZE),
                }),
            };
    }
}
