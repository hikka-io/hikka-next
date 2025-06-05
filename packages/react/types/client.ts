import { ClientArgs, PaginationArgs } from '@hikka/client';

export interface UseClientByReferenceParams {
    reference: string;
}

export interface UseFullClientInfoParams {
    reference: string;
}

export interface UseClientListParams {
    paginationArgs?: PaginationArgs;
}

export interface UseUpdateClientParams {
    reference: string;
    args: ClientArgs;
}

export interface UseVerifyClientParams {
    reference: string;
}
