import { QuerySearchArgs } from '@hikka/client';

export interface UsePersonInfoParams {
    slug: string;
}

export interface UsePersonAnimeParams {
    slug: string;
}

export interface UsePersonMangaParams {
    slug: string;
}

export interface UsePersonNovelParams {
    slug: string;
}

export interface UsePersonCharactersParams {
    slug: string;
}

export interface UsePeopleSearchParams {
    args?: QuerySearchArgs;
}
