import { AnimeSearchArgs } from '@hikka/client';

export interface UseAnimeInfoParams {
    slug: string;
}

export interface UseAnimeCharactersParams {
    slug: string;
}

export interface UseAnimeEpisodesParams {
    slug: string;
}

export interface UseAnimeFranchiseParams {
    slug: string;
}

export interface UseAnimeRecommendationsParams {
    slug: string;
}

export interface UseAnimeStaffParams {
    slug: string;
}

export interface UseAnimeSearchParams {
    args: AnimeSearchArgs;
}
