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
 * Client create/update arguments
 */
export interface ClientArgs {
    name: string;
    description: string;
    endpoint: string;
    revoke_secret?: boolean;
}

/**
 * Client create response
 */
export interface ClientCreateResponse extends ClientResponse {
    secret: string;
}
