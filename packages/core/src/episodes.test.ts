import { describe, expect, it } from 'vitest';

import {
    findNextEpisode,
    formatEpisodeCount,
    formatEpisodeDuration,
    formatNextEpisodeDate,
} from './episodes';

describe('formatEpisodeCount', () => {
    it('shows the total for a finished anime', () => {
        expect(formatEpisodeCount('finished', 12, 12)).toBe('12');
        expect(formatEpisodeCount('finished', 12, null)).toBe('?');
    });

    it('shows released / total otherwise', () => {
        expect(formatEpisodeCount('ongoing', 5, 24)).toBe('5 / 24');
        expect(formatEpisodeCount('ongoing', null, null)).toBe('? / ?');
    });
});

describe('formatEpisodeDuration', () => {
    it('writes minutes and hours in Ukrainian', () => {
        expect(formatEpisodeDuration(24)).toBe('24 хвилини');
        expect(formatEpisodeDuration(100)).toBe('1 годину 40 хвилин');
    });
});

describe('findNextEpisode', () => {
    it('returns the first episode airing after now and skips malformed items', () => {
        const schedule = [
            { airing_at: 100, episode: 1 },
            { airing_at: 'soon' },
            { airing_at: 300, episode: 3 },
        ];

        expect(findNextEpisode(schedule, 200_000)).toEqual({
            airing_at: 300,
            episode: 3,
        });
        expect(findNextEpisode(schedule, 400_000)).toBeUndefined();
    });
});

describe('formatNextEpisodeDate', () => {
    it('formats day, month and time', () => {
        const airingAt = new Date(2026, 9, 20, 18, 30).getTime() / 1000;

        expect(formatNextEpisodeDate(airingAt)).toBe('20 жовтня 18:30');
    });
});
