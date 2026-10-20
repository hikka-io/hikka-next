import { describe, expect, it } from 'vitest';

import type { HistoryResponse } from '@hikka/api';

import { summarizeHistory } from './history-summary';

const history = (history_type: string, data: Record<string, unknown> = {}) =>
    ({ history_type, data }) as unknown as HistoryResponse;

describe('summarizeHistory', () => {
    it('describes a status change with progress and score', () => {
        expect(
            summarizeHistory(
                history('watch', {
                    before: { status: 'planned', episodes: 0, score: 0 },
                    after: { status: 'watching', episodes: 3, score: 8 },
                }),
            ),
        ).toBe('Дивлюсь · 3 епізоди · оцінка 8');
    });

    it('describes read progress', () => {
        expect(
            summarizeHistory(
                history('read_manga', {
                    before: { status: 'reading', chapters: 10 },
                    after: { status: 'reading', chapters: 12 },
                }),
            ),
        ).toBe('12 розділів');
    });

    it.each([
        ['watch_delete', 'Видалено зі списку'],
        ['favourite_manga_add', 'Додано в улюблене'],
        ['favourite_anime_remove', 'Прибрано з улюбленого'],
        ['watch_import', 'Імпортовано список'],
    ])('labels %s', (type, label) => {
        expect(summarizeHistory(history(type))).toBe(label);
    });

    it('falls back when nothing changed', () => {
        expect(summarizeHistory(history('watch', {}))).toBe('Запис оновлено');
    });
});
