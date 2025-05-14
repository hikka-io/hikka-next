import { DEFAULT_PAGINATION } from '../constants';
import {
    BaseRequestOptionsArgs,
    PaginationArgs,
    PersonAnimePaginationResponse,
    PersonCharactersPaginationResponse,
    PersonCountResponse,
    PersonMangaPaginationResponse,
    PersonNovelPaginationResponse,
    PersonSearchPaginationResponse,
    QuerySearchArgs,
} from '../types';
import { BaseModule } from './base';

export class PeopleModule extends BaseModule {
    /**
     * Get person details by slug
     */
    public async getPersonBySlug(
        slug: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<PersonCountResponse> {
        return this.client.get<PersonCountResponse>(`/people/${slug}`, options);
    }

    /**
     * Search for people with filtering criteria
     */
    public async searchPeople(
        args: QuerySearchArgs,
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<PersonSearchPaginationResponse> {
        return this.client.post<PersonSearchPaginationResponse>(
            '/people',
            args,
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
                ...options,
            },
        );
    }

    /**
     * Get anime work for a person
     */
    public async getPersonAnime(
        slug: string,
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<PersonAnimePaginationResponse> {
        return this.client.get<PersonAnimePaginationResponse>(
            `/people/${slug}/anime`,
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
                ...options,
            },
        );
    }

    /**
     * Get manga work for a person
     */
    public async getPersonManga(
        slug: string,
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<PersonMangaPaginationResponse> {
        return this.client.get<PersonMangaPaginationResponse>(
            `/people/${slug}/manga`,
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
                ...options,
            },
        );
    }

    /**
     * Get novel work for a person
     */
    public async getPersonNovel(
        slug: string,
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<PersonNovelPaginationResponse> {
        return this.client.get<PersonNovelPaginationResponse>(
            `/people/${slug}/novel`,
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
                ...options,
            },
        );
    }

    /**
     * Get characters voiced by a person
     */
    public async getPersonCharacters(
        slug: string,
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<PersonCharactersPaginationResponse> {
        return this.client.get<PersonCharactersPaginationResponse>(
            `/people/${slug}/characters`,
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
                ...options,
            },
        );
    }
}
