import { DEFAULT_PAGINATION } from '../constants';
import {
    AuthTokenInfoPaginationResponse,
    AuthTokenInfoResponse,
    CaptchaArgs,
    CodeArgs,
    ComfirmResetArgs,
    EmailArgs,
    LoginArgs,
    PaginationArgs,
    ProviderUrlResponse,
    SignupArgs,
    TokenArgs,
    TokenProceedArgs,
    TokenRequestArgs,
    TokenRequestResponse,
    TokenResponse,
    UserResponse,
} from '../types';
import { BaseModule } from './base';

export class AuthModule extends BaseModule {
    /**
     * Create a user session with credentials
     */
    public async createUserSession(
        args: LoginArgs,
        { captcha }: CaptchaArgs,
    ): Promise<TokenResponse> {
        return this.client.post<TokenResponse>('/auth/login', args, {
            headers: { captcha },
        });
    }

    /**
     * Create a new user account
     */
    public async createUser(
        args: SignupArgs,
        { captcha }: CaptchaArgs,
    ): Promise<TokenResponse> {
        return this.client.post<TokenResponse>('/auth/signup', args, {
            headers: { captcha },
        });
    }

    /**
     * Activate a user account with token
     */
    public async activateUser(args: TokenArgs): Promise<TokenResponse> {
        return this.client.post<TokenResponse>('/auth/activation', args);
    }

    /**
     * Create a new activation link request
     */
    public async createActivationRequest(): Promise<UserResponse> {
        return this.client.post<UserResponse>('/auth/activation/resend');
    }

    /**
     * Create a password reset request
     */
    public async createPasswordResetRequest(
        args: EmailArgs,
    ): Promise<UserResponse> {
        return this.client.post<UserResponse>('/auth/password/reset', args);
    }

    /**
     * Confirm password reset with token
     */
    public async confirmPasswordReset(
        args: ComfirmResetArgs,
    ): Promise<TokenResponse> {
        return this.client.post<TokenResponse>('/auth/password/confirm', args);
    }

    /**
     * Get OAuth provider authorization URL
     */
    public async getOAuthProviderUrl(
        provider: string,
    ): Promise<ProviderUrlResponse> {
        return this.client.get<ProviderUrlResponse>(`/auth/oauth/${provider}`);
    }

    /**
     * Create a token from OAuth authorization code
     */
    public async createOAuthToken(
        provider: string,
        args: CodeArgs,
    ): Promise<TokenResponse> {
        return this.client.post<TokenResponse>(`/auth/oauth/${provider}`, args);
    }

    /**
     * Get current authentication token details
     */
    public async getAuthTokenDetails(): Promise<AuthTokenInfoResponse> {
        return this.client.get<AuthTokenInfoResponse>('/auth/token/info');
    }

    /**
     * Create a token request for a third-party client
     */
    public async createThirdPartyTokenRequest(
        clientReference: string,
        args: TokenRequestArgs,
    ): Promise<TokenRequestResponse> {
        return this.client.post<TokenRequestResponse>(
            `/auth/token/request/${clientReference}`,
            args,
        );
    }

    /**
     * Create a token for a third-party client
     */
    public async createThirdPartyToken(
        args: TokenProceedArgs,
    ): Promise<TokenResponse> {
        return this.client.post<TokenResponse>('/auth/token', args);
    }

    /**
     * Get third-party tokens list
     */
    public async getThirdPartyTokenList({
        page,
        size,
    }: PaginationArgs = DEFAULT_PAGINATION): Promise<AuthTokenInfoPaginationResponse> {
        return this.client.get<AuthTokenInfoPaginationResponse>(
            '/auth/token/thirdparty',
            {
                page,
                size,
            },
        );
    }

    /**
     * Delete an authentication token
     */
    public async deleteAuthToken(
        tokenReference: string,
    ): Promise<AuthTokenInfoResponse> {
        return this.client.delete<AuthTokenInfoResponse>(
            `/auth/token/${tokenReference}`,
        );
    }
}
