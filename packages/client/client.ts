import fetch from 'cross-fetch';

import { HikkaApiError } from './errors';
import { AnimeModule } from './modules/anime';
import { ArticlesModule } from './modules/articles';
import { AuthModule } from './modules/auth';
import { CharactersModule } from './modules/characters';
import { ClientModule } from './modules/client';
import { CollectionsModule } from './modules/collections';
import { CommentsModule } from './modules/comments';
import { CompaniesModule } from './modules/companies';
import { EditModule } from './modules/edit';
import { FavouriteModule } from './modules/favourite';
import { FollowModule } from './modules/follow';
import { GenresModule } from './modules/genres';
import { HistoryModule } from './modules/history';
import { MangaModule } from './modules/manga';
import { NotificationsModule } from './modules/notifications';
import { NovelModule } from './modules/novel';
import { PeopleModule } from './modules/people';
import { ReadModule } from './modules/read';
import { RelatedModule } from './modules/related';
import { ScheduleModule } from './modules/schedule';
import { SettingsModule } from './modules/settings';
import { SitemapModule } from './modules/sitemap';
import { StatsModule } from './modules/stats';
import { UploadModule } from './modules/upload';
import { UserModule } from './modules/user';
import { VoteModule } from './modules/vote';
import { WatchModule } from './modules/watch';

export interface HikkaClientConfig {
    baseUrl?: string;
    authToken?: string;
}

/**
 * Main client for the Hikka API
 */
export class HikkaClient {
    private baseUrl: string;
    private authToken?: string;

    // API modules
    public auth: AuthModule;
    public anime: AnimeModule;
    public articles: ArticlesModule;
    public manga: MangaModule;
    public novel: NovelModule;
    public user: UserModule;
    public notifications: NotificationsModule;
    public collections: CollectionsModule;
    public characters: CharactersModule;
    public people: PeopleModule;
    public favourite: FavouriteModule;
    public follow: FollowModule;
    public genres: GenresModule;
    public companies: CompaniesModule;
    public related: RelatedModule;
    public client: ClientModule;
    public edit: EditModule;
    public history: HistoryModule;
    public schedule: ScheduleModule;
    public stats: StatsModule;
    public watch: WatchModule;
    public read: ReadModule;
    public comments: CommentsModule;
    public settings: SettingsModule;
    public upload: UploadModule;
    public vote: VoteModule;
    public sitemap: SitemapModule;

    constructor(config: HikkaClientConfig) {
        this.baseUrl = config.baseUrl || 'https://api.hikka.io';
        this.authToken = config.authToken;

        // Initialize modules
        this.auth = new AuthModule(this);
        this.anime = new AnimeModule(this);
        this.articles = new ArticlesModule(this);
        this.manga = new MangaModule(this);
        this.novel = new NovelModule(this);
        this.user = new UserModule(this);
        this.notifications = new NotificationsModule(this);
        this.collections = new CollectionsModule(this);
        this.characters = new CharactersModule(this);
        this.people = new PeopleModule(this);
        this.favourite = new FavouriteModule(this);
        this.follow = new FollowModule(this);
        this.genres = new GenresModule(this);
        this.companies = new CompaniesModule(this);
        this.related = new RelatedModule(this);
        this.client = new ClientModule(this);
        this.edit = new EditModule(this);
        this.history = new HistoryModule(this);
        this.schedule = new ScheduleModule(this);
        this.stats = new StatsModule(this);
        this.watch = new WatchModule(this);
        this.read = new ReadModule(this);
        this.comments = new CommentsModule(this);
        this.settings = new SettingsModule(this);
        this.upload = new UploadModule(this);
        this.vote = new VoteModule(this);
        this.sitemap = new SitemapModule(this);
    }

    /**
     * Set the authentication token for API requests
     */
    public setAuthToken(token: string): void {
        this.authToken = token;
    }

    /**
     * Clear the authentication token
     */
    public clearAuthToken(): void {
        this.authToken = undefined;
    }

    /**
     * Get the current auth token
     */
    public getAuthToken(): string | undefined {
        return this.authToken;
    }

    /**
     * Get the base URL
     */
    public getBaseUrl(): string {
        return this.baseUrl;
    }

    /**
     * Make a GET request to the API
     */
    public async get<T>(
        path: string,
        queryParams?: Record<string, any>,
    ): Promise<T> {
        return this.request<T>('GET', path, undefined, queryParams);
    }

    /**
     * Make a POST request to the API
     */
    public async post<T>(
        path: string,
        body?: any,
        queryParams?: Record<string, any>,
    ): Promise<T> {
        return this.request<T>('POST', path, body, queryParams);
    }

    /**
     * Make a PUT request to the API
     */
    public async put<T>(
        path: string,
        body?: any,
        queryParams?: Record<string, any>,
    ): Promise<T> {
        return this.request<T>('PUT', path, body, queryParams);
    }

    /**
     * Make a DELETE request to the API
     */
    public async delete<T>(
        path: string,
        queryParams?: Record<string, any>,
    ): Promise<T> {
        return this.request<T>('DELETE', path, undefined, queryParams);
    }

    /**
     * Make a request to the API
     */
    private async request<T>(
        method: string,
        path: string,
        body?: any,
        queryParams?: Record<string, any>,
    ): Promise<T> {
        const url = new URL(`${this.baseUrl}${path}`);

        // Add query parameters
        if (queryParams) {
            Object.entries(queryParams).forEach(([key, value]) => {
                if (
                    value !== undefined &&
                    value !== null &&
                    key !== 'headers'
                ) {
                    url.searchParams.append(key, String(value));
                }
            });
        }

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        // Add auth token if available
        if (this.authToken) {
            headers['auth'] = this.authToken;
        }

        // Special handling for captcha header
        if (queryParams?.headers?.captcha) {
            headers['captcha'] = queryParams.headers.captcha;
        }

        const response = await fetch(url.toString(), {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new HikkaApiError(
                errorData?.message ||
                    `API request failed with status ${response.status}`,
                response.status,
                errorData?.code || 'unknown_error',
                errorData,
            );
        }

        return response.json() as Promise<T>;
    }
}
