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
     * Login to the API
     */
    public async login(
        args: LoginArgs,
        { captcha }: CaptchaArgs,
    ): Promise<TokenResponse> {
        return this.client.post<TokenResponse>('/auth/login', args, {
            headers: { captcha },
        });
    }

    /**
     * Register a new user
     */
    public async signup(
        args: SignupArgs,
        { captcha }: CaptchaArgs,
    ): Promise<TokenResponse> {
        return this.client.post<TokenResponse>('/auth/signup', args, {
            headers: { captcha },
        });
    }

    /**
     * Activate an account
     */
    public async activate(args: TokenArgs): Promise<TokenResponse> {
        return this.client.post<TokenResponse>('/auth/activation', args);
    }

    /**
     * Resend activation link
     */
    public async resendActivation(): Promise<UserResponse> {
        return this.client.post<UserResponse>('/auth/activation/resend');
    }

    /**
     * Request password reset
     */
    public async requestPasswordReset(args: EmailArgs): Promise<UserResponse> {
        return this.client.post<UserResponse>('/auth/password/reset', args);
    }

    /**
     * Confirm password reset
     */
    public async confirmPasswordReset(
        args: ComfirmResetArgs,
    ): Promise<TokenResponse> {
        return this.client.post<TokenResponse>('/auth/password/confirm', args);
    }

    /**
     * Get OAuth provider URL
     */
    public async getOAuthUrl(provider: string): Promise<ProviderUrlResponse> {
        return this.client.get<ProviderUrlResponse>(`/auth/oauth/${provider}`);
    }

    /**
     * Get token from OAuth code
     */
    public async getOAuthToken(
        provider: string,
        args: CodeArgs,
    ): Promise<TokenResponse> {
        return this.client.post<TokenResponse>(`/auth/oauth/${provider}`, args);
    }

    /**
     * Get current token info
     */
    public async getTokenInfo(): Promise<AuthTokenInfoResponse> {
        return this.client.get<AuthTokenInfoResponse>('/auth/token/info');
    }

    /**
     * Request token for a third-party client
     */
    public async requestThirdPartyToken(
        clientReference: string,
        args: TokenRequestArgs,
    ): Promise<TokenRequestResponse> {
        return this.client.post<TokenRequestResponse>(
            `/auth/token/request/${clientReference}`,
            args,
        );
    }

    /**
     * Create token for a third-party client
     */
    public async createThirdPartyToken(
        args: TokenProceedArgs,
    ): Promise<TokenResponse> {
        return this.client.post<TokenResponse>('/auth/token', args);
    }

    /**
     * List third-party tokens
     */
    public async listThirdPartyTokens(
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<AuthTokenInfoPaginationResponse> {
        return this.client.get<AuthTokenInfoPaginationResponse>(
            '/auth/token/thirdparty',
            {
                page,
                size,
            },
        );
    }

    /**
     * Revoke token
     */
    public async revokeToken(
        tokenReference: string,
    ): Promise<AuthTokenInfoResponse> {
        return this.client.delete<AuthTokenInfoResponse>(
            `/auth/token/${tokenReference}`,
        );
    }
}
