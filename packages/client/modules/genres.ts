import { GenreListResponse } from '../types';
import { BaseModule } from './base';

/**
 * Module for handling genres
 */
export class GenresModule extends BaseModule {
    /**
     * Get all genres
     */
    public async getGenres(): Promise<GenreListResponse> {
        return this.client.get<GenreListResponse>('/genres');
    }
}
