import {
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
    public async getPersonBySlug(slug: string): Promise<PersonCountResponse> {
        return this.client.get<PersonCountResponse>(`/people/${slug}`);
    }

    /**
     * Search for people with filtering criteria
     */
    public async searchPeople(
        args: QuerySearchArgs,
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<PersonSearchPaginationResponse> {
        return this.client.post<PersonSearchPaginationResponse>(
            '/people',
            args,
            {
                page,
                size,
            },
        );
    }

    /**
     * Get anime work for a person
     */
    public async getPersonAnime(
        slug: string,
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<PersonAnimePaginationResponse> {
        return this.client.get<PersonAnimePaginationResponse>(
            `/people/${slug}/anime`,
            {
                page,
                size,
            },
        );
    }

    /**
     * Get manga work for a person
     */
    public async getPersonManga(
        slug: string,
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<PersonMangaPaginationResponse> {
        return this.client.get<PersonMangaPaginationResponse>(
            `/people/${slug}/manga`,
            {
                page,
                size,
            },
        );
    }

    /**
     * Get novel work for a person
     */
    public async getPersonNovel(
        slug: string,
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<PersonNovelPaginationResponse> {
        return this.client.get<PersonNovelPaginationResponse>(
            `/people/${slug}/novel`,
            {
                page,
                size,
            },
        );
    }

    /**
     * Get characters voiced by a person
     */
    public async getPersonCharacters(
        slug: string,
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<PersonCharactersPaginationResponse> {
        return this.client.get<PersonCharactersPaginationResponse>(
            `/people/${slug}/characters`,
            {
                page,
                size,
            },
        );
    }
}
