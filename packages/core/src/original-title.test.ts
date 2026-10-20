import { describe, expect, it } from 'vitest';

import type { AnimeInfoResponse, MangaInfoResponse } from '@hikka/api';

import { getOriginalTitle } from './original-title';

describe('getOriginalTitle', () => {
    it('uses title_ja for anime and title_original otherwise', () => {
        expect(
            getOriginalTitle({
                data_type: 'anime',
                title_ja: 'Sousou no Frieren',
            } as AnimeInfoResponse),
        ).toBe('Sousou no Frieren');
        expect(
            getOriginalTitle({
                data_type: 'manga',
                title_original: 'Berserk',
            } as MangaInfoResponse),
        ).toBe('Berserk');
    });
});
