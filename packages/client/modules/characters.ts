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
     * Get character details by slug
     */
    public async getCharacterBySlug(
        slug: string,
    ): Promise<CharacterCountResponse> {
        return this.client.get<CharacterCountResponse>(`/characters/${slug}`);
    }

    /**
     * Search for characters with filtering criteria
     */
    public async searchCharacters(
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
     * Get anime appearances for a character
     */
    public async getCharacterAnime(
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
     * Get manga appearances for a character
     */
    public async getCharacterManga(
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
     * Get novel appearances for a character
     */
    public async getCharacterNovel(
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
     * Get voice actors for a character
     */
    public async getCharacterVoices(
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
