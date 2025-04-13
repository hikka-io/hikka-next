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
 * Client response for auth token
 */
export interface ClientResponse {
    reference: string;
    name: string;
    description: string;
    verified: boolean;
    user: {
        reference: string;
        updated: number | null;
        created: number;
        description: string | null;
        username: string | null;
        cover: string | null;
        active: boolean;
        avatar: string;
        role: string;
    };
    created: number;
    updated: number;
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
