import { describe, expect, it } from 'vitest';

import { AnilistTypeEnum } from './use-anilist';

describe('AnilistTypeEnum', () => {
    it('keeps the AniList media type values', () => {
        expect(Object.values(AnilistTypeEnum)).toEqual(['ANIME', 'MANGA']);
    });
});
