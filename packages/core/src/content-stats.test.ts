import { describe, expect, it } from 'vitest';

import { contentScoreStats, contentStatusStats } from './content-stats';

describe('contentStatusStats', () => {
    it('lists every watch status in order with its share', () => {
        const stats = contentStatusStats(
            { completed: 6, watching: 2, planned: 2 },
            'anime',
        );

        expect(stats.map((entry) => entry.key)).toEqual([
            'completed',
            'watching',
            'planned',
            'dropped',
            'on_hold',
        ]);
        expect(stats[0]).toEqual({
            key: 'completed',
            count: 6,
            percentage: 60,
        });
        expect(stats[3]).toEqual({ key: 'dropped', count: 0, percentage: 0 });
    });

    it('uses the read statuses for manga and novels', () => {
        expect(
            contentStatusStats({ reading: 1 }, 'novel').map(
                (entry) => entry.key,
            ),
        ).toEqual(['completed', 'reading', 'planned', 'dropped', 'on_hold']);
    });

    it('reports zero shares when nobody tracks the title', () => {
        expect(
            contentStatusStats({}, 'manga').every(
                (entry) => entry.percentage === 0,
            ),
        ).toBe(true);
    });
});

describe('contentScoreStats', () => {
    it('lists the given scores from 10 down with their shares', () => {
        expect(
            contentScoreStats({ score_10: 3, score_7: 1, score_1: 0 }),
        ).toEqual([
            { key: 10, count: 3, percentage: 75 },
            { key: 7, count: 1, percentage: 25 },
        ]);
    });

    it('is empty without scores', () => {
        expect(contentScoreStats({ completed: 4 })).toEqual([]);
    });
});
