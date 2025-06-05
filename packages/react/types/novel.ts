import { NovelSearchArgs } from '@hikka/client';

export interface UseNovelInfoParams {
    slug: string;
}

export interface UseNovelCharactersParams {
    slug: string;
}

export interface UseSearchNovelsParams {
    args: NovelSearchArgs;
}
