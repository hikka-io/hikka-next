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
     * Get person info by slug
     */
    public async getBySlug(slug: string): Promise<PersonCountResponse> {
        return this.client.get<PersonCountResponse>(`/people/${slug}`);
    }

    /**
     * Search for people
     */
    public async search(
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
     * Get person's anime work
     */
    public async getAnime(
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
     * Get person's manga work
     */
    public async getManga(
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
     * Get person's novel work
     */
    public async getNovel(
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
     * Get character voiced by this person
     */
    public async getCharacters(
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
