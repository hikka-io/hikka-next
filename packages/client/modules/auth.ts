import { DEFAULT_PAGINATION } from '../constants';
import {
    AuthTokenInfoPaginationResponse,
    AuthTokenInfoResponse,
    BaseRequestOptionsArgs,
    CaptchaArgs,
    CodeArgs,
    ComfirmResetArgs,
    EmailArgs,
    EmailLoginArgs,
    PaginationArgs,
    ProviderUrlResponse,
    SignupArgs,
    TokenArgs,
    TokenProceedArgs,
    TokenRequestArgs,
    TokenRequestResponse,
    TokenResponse,
    UsernameLoginArgs,
    UserResponse,
} from '../types';
import { BaseModule } from './base';

export class AuthModule extends BaseModule {
    /**
     * Create a user session with credentials
     */
    public async createUserSession(
        args: EmailLoginArgs | UsernameLoginArgs,
        { captcha }: CaptchaArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<TokenResponse> {
        return this.client.post<TokenResponse>('/auth/login', args, {
            headers: { captcha },
            ...options,
        });
    }

    /**
     * Create a new user account
     */
    public async createUser(
        args: SignupArgs,
        { captcha }: CaptchaArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<TokenResponse> {
        return this.client.post<TokenResponse>('/auth/signup', args, {
            headers: { captcha },
            ...options,
        });
    }

    /**
     * Activate a user account with token
     */
    public async activateUser(
        args: TokenArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<TokenResponse> {
        return this.client.post<TokenResponse>(
            '/auth/activation',
            args,
            options,
        );
    }

    /**
     * Create a new activation link request
     */
    public async createActivationRequest(
        options?: BaseRequestOptionsArgs,
    ): Promise<UserResponse> {
        return this.client.post<UserResponse>(
            '/auth/activation/resend',
            undefined,
            options,
        );
    }

    /**
     * Create a password reset request
     */
    public async createPasswordResetRequest(
        args: EmailArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<UserResponse> {
        return this.client.post<UserResponse>(
            '/auth/password/reset',
            args,
            options,
        );
    }

    /**
     * Confirm password reset with token
     */
    public async confirmPasswordReset(
        args: ComfirmResetArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<TokenResponse> {
        return this.client.post<TokenResponse>(
            '/auth/password/confirm',
            args,
            options,
        );
    }

    /**
     * Get OAuth provider authorization URL
     */
    public async getOAuthProviderUrl(
        provider: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<ProviderUrlResponse> {
        return this.client.get<ProviderUrlResponse>(
            `/auth/oauth/${provider}`,
            options,
        );
    }

    /**
     * Create a token from OAuth authorization code
     */
    public async createOAuthToken(
        provider: string,
        args: CodeArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<TokenResponse> {
        return this.client.post<TokenResponse>(
            `/auth/oauth/${provider}`,
            args,
            options,
        );
    }

    /**
     * Get current authentication token details
     */
    public async getAuthTokenDetails(
        options?: BaseRequestOptionsArgs,
    ): Promise<AuthTokenInfoResponse> {
        return this.client.get<AuthTokenInfoResponse>(
            '/auth/token/info',
            options,
        );
    }

    /**
     * Create a token request for a third-party client
     */
    public async createThirdPartyTokenRequest(
        clientReference: string,
        args: TokenRequestArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<TokenRequestResponse> {
        return this.client.post<TokenRequestResponse>(
            `/auth/token/request/${clientReference}`,
            args,
            options,
        );
    }

    /**
     * Create a token for a third-party client
     */
    public async createThirdPartyToken(
        args: TokenProceedArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<TokenResponse> {
        return this.client.post<TokenResponse>('/auth/token', args, options);
    }

    /**
     * Get third-party tokens list
     */
    public async getThirdPartyTokenList(
        { page, size }: PaginationArgs = DEFAULT_PAGINATION,
        options?: BaseRequestOptionsArgs,
    ): Promise<AuthTokenInfoPaginationResponse> {
        return this.client.get<AuthTokenInfoPaginationResponse>(
            '/auth/token/thirdparty',
            {
                page,
                size,
                ...options,
            },
        );
    }

    /**
     * Delete an authentication token
     */
    public async deleteAuthToken(
        tokenReference: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<AuthTokenInfoResponse> {
        return this.client.delete<AuthTokenInfoResponse>(
            `/auth/token/${tokenReference}`,
            options,
        );
    }
}
