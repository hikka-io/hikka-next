import { PaginatedResponse, SuccessResponse } from './common';
import { UserResponse } from './user';

/**
 * Client response
 */
export interface ClientResponse {
    reference: string;
    name: string;
    description: string;
    verified: boolean;
    user: UserResponse;
    created: number;
    updated: number;
}

/**
 * Full client info response
 */
export interface ClientInfoResponse extends ClientResponse {
    secret: string;
    endpoint: string;
}

/**
 * Client create/update arguments
 */
export interface ClientArgs {
    name: string;
    description: string;
    endpoint: string;
    revoke_secret?: boolean;
}

/**
 * Clients pagination response
 */
export interface ClientPaginationResponse
    extends PaginatedResponse<ClientResponse> {}

/**
 * Client verification response
 */
export interface ClientVerifyResponse extends SuccessResponse {
    verified: boolean;
}
