import {
    CharacterAnimePaginationResponse,
    CharacterCountResponse,
    CharacterMangaPaginationResponse,
    CharacterNovelPaginationResponse,
    CharacterVoicesPaginationResponse,
    CharactersSearchPaginationResponse,
    PaginationArgs,
    QuerySearchArgs,
} from '../types';
import { BaseModule } from './base';

export class CharactersModule extends BaseModule {
    /**
     * Get character info by slug
     */
    public async getBySlug(slug: string): Promise<CharacterCountResponse> {
        return this.client.get<CharacterCountResponse>(`/characters/${slug}`);
    }

    /**
     * Search for characters
     */
    public async search(
        args: QuerySearchArgs,
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<CharactersSearchPaginationResponse> {
        return this.client.post<CharactersSearchPaginationResponse>(
            '/characters',
            args,
            {
                page,
                size,
            },
        );
    }

    /**
     * Get character's anime appearances
     */
    public async getAnime(
        slug: string,
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<CharacterAnimePaginationResponse> {
        return this.client.get<CharacterAnimePaginationResponse>(
            `/characters/${slug}/anime`,
            {
                page,
                size,
            },
        );
    }

    /**
     * Get character's manga appearances
     */
    public async getManga(
        slug: string,
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<CharacterMangaPaginationResponse> {
        return this.client.get<CharacterMangaPaginationResponse>(
            `/characters/${slug}/manga`,
            {
                page,
                size,
            },
        );
    }

    /**
     * Get character's novel appearances
     */
    public async getNovel(
        slug: string,
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<CharacterNovelPaginationResponse> {
        return this.client.get<CharacterNovelPaginationResponse>(
            `/characters/${slug}/novel`,
            {
                page,
                size,
            },
        );
    }

    /**
     * Get character's voice actors
     */
    public async getVoices(
        slug: string,
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<CharacterVoicesPaginationResponse> {
        return this.client.get<CharacterVoicesPaginationResponse>(
            `/characters/${slug}/voices`,
            {
                page,
                size,
            },
        );
    }
}
