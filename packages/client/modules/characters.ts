import { DEFAULT_PAGINATION } from '../constants';
import {
    BaseRequestOptionsArgs,
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
        options?: BaseRequestOptionsArgs,
    ): Promise<CharacterCountResponse> {
        return this.client.get<CharacterCountResponse>(
            `/characters/${slug}`,
            options,
        );
    }

    /**
     * Search for characters with filtering criteria
     */
    public async searchCharacters(
        args: QuerySearchArgs,
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<CharactersSearchPaginationResponse> {
        return this.client.post<CharactersSearchPaginationResponse>(
            '/characters',
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
     * Get anime appearances for a character
     */
    public async getCharacterAnime(
        slug: string,
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<CharacterAnimePaginationResponse> {
        return this.client.get<CharacterAnimePaginationResponse>(
            `/characters/${slug}/anime`,
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
                ...options,
            },
        );
    }

    /**
     * Get manga appearances for a character
     */
    public async getCharacterManga(
        slug: string,
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<CharacterMangaPaginationResponse> {
        return this.client.get<CharacterMangaPaginationResponse>(
            `/characters/${slug}/manga`,
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
                ...options,
            },
        );
    }

    /**
     * Get novel appearances for a character
     */
    public async getCharacterNovel(
        slug: string,
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<CharacterNovelPaginationResponse> {
        return this.client.get<CharacterNovelPaginationResponse>(
            `/characters/${slug}/novel`,
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
                ...options,
            },
        );
    }

    /**
     * Get voice actors for a character
     */
    public async getCharacterVoices(
        slug: string,
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<CharacterVoicesPaginationResponse> {
        return this.client.get<CharacterVoicesPaginationResponse>(
            `/characters/${slug}/voices`,
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
                ...options,
            },
        );
    }
}
