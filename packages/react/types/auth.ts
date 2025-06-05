import { PaginationArgs } from '@hikka/client';

export interface UseOAuthProviderUrlParams {
    provider: string;
}

export interface UseThirdPartyTokenListParams {
    paginationArgs?: PaginationArgs;
}
