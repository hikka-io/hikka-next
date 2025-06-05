import { ClientResponse } from './client';

/**
 * Login request parameters
 */
export interface LoginArgs {
    email: string;
    password: string;
}

/**
 * Signup request parameters
 */
export interface SignupArgs {
    email: string;
    password: string;
    username: string;
}

/**
 * Token response
 */
export interface TokenResponse {
    expiration: number;
    created: number;
    secret: string;
}

/**
 * Token request parameters
 */
export interface TokenArgs {
    token: string;
}

/**
 * Email request parameters
 */
export interface EmailArgs {
    email: string;
}

/**
 * Password reset confirmation parameters
 */
export interface ComfirmResetArgs {
    token: string;
    password: string;
}

/**
 * OAuth code arguments
 */
export interface CodeArgs {
    code: string;
}

/**
 * OAuth provider URL response
 */
export interface ProviderUrlResponse {
    url: string;
}

/**
 * Auth token info response
 */
export interface AuthTokenInfoResponse {
    reference: string;
    created: number;
    client: ClientResponse | null;
    scope: string[];
    expiration: number;
    used: number | null;
}

/**
 * Paginated auth token info response
 */
export interface AuthTokenInfoPaginationResponse {
    list: AuthTokenInfoResponse[];
    pagination: {
        total: number;
        pages: number;
        page: number;
    };
}

/**
 * Token request arguments
 */
export interface TokenRequestArgs {
    scope: string[];
}

/**
 * Token request response
 */
export interface TokenRequestResponse {
    reference: string;
    redirect_url: string;
    expiration: number;
}

/**
 * Token proceed arguments
 */
export interface TokenProceedArgs {
    request_reference: string;
    client_secret: string;
}
