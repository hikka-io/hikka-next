import { PaginationArgs, QuerySearchArgs } from '@hikka/client';

export interface UseCharacterInfoParams {
    slug: string;
}

export interface UseCharacterContentParams {
    slug: string;
    paginationArgs?: PaginationArgs;
}

export interface UseCharactersSearchParams {
    args?: QuerySearchArgs;
}
