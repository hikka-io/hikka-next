import { MangaSearchArgs } from '@hikka/client';

export interface UseMangaInfoParams {
    slug: string;
}

export interface UseMangaCharactersParams {
    slug: string;
}

export interface UseSearchMangasParams {
    args: MangaSearchArgs;
}
