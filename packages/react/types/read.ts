import { ReadContentType, ReadSearchArgs } from '@hikka/client';

export interface UseReadEntryParams {
    contentType: ReadContentType;
    slug: string;
}

export interface UseReadStatsParams {
    contentType: ReadContentType;
    username: string;
}

export interface UseReadListParams {
    contentType: ReadContentType;
    username: string;
    args: ReadSearchArgs;
}

export interface UseReadingUsersParams {
    contentType: ReadContentType;
    slug: string;
}
