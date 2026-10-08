import { describe, expect, it } from 'vitest';

import { type HistoryResponse, HistoryTypeEnum } from '@hikka/api';

import { convertHistory } from './convert-history';
import type { HistoryEntry } from './types';

const TIME_ZONE = 'Europe/Kyiv';
const MAY_28 = Date.UTC(2025, 4, 28, 12) / 1000;
const MAY_17 = Date.UTC(2025, 4, 17, 12) / 1000;
const JUNE_3 = Date.UTC(2025, 5, 3, 12) / 1000;

const ANIME = { data_type: 'anime', episodes_total: 28 };
const NO_TOTAL = { data_type: 'anime', episodes_total: null };
const MANGA = { data_type: 'manga', chapters: 327, volumes: 37 };
const NO_CHAPTERS = { data_type: 'manga', chapters: null, volumes: null };

const history = (
    history_type: HistoryTypeEnum,
    data: Record<string, unknown>,
    content: Record<string, unknown> | null = ANIME,
) =>
    ({
        history_type,
        data,
        content,
        created: MAY_28,
        updated: MAY_28,
        reference: 'ref',
        user: {},
    }) as unknown as HistoryResponse;

const watch = (
    before: Record<string, unknown> | null,
    after: Record<string, unknown>,
    content: Record<string, unknown> = ANIME,
    extra: Record<string, unknown> = {},
) => history(HistoryTypeEnum.WATCH, { before, after, ...extra }, content);

const read = (
    before: Record<string, unknown> | null,
    after: Record<string, unknown>,
    content: Record<string, unknown> = MANGA,
    extra: Record<string, unknown> = {},
) => history(HistoryTypeEnum.READ_MANGA, { before, after, ...extra }, content);

const lines = (entry: HistoryEntry) =>
    entry.facts.map((item) =>
        item
            .map((part) => part.text)
            .join('')
            .replaceAll('\u00A0', ' '),
    );

const convert = (item: HistoryResponse) => convertHistory(item, TIME_ZONE);

describe('convertHistory: list status', () => {
    it.each([
        ['planned', 'Додано в Заплановано'],
        ['watching', 'Додано в Дивлюсь'],
        ['completed', 'Додано в Завершено'],
        ['on_hold', 'Додано у Відкладено'],
        ['dropped', 'Додано в Закинуто'],
    ])('adds a new %s entry', (status, text) => {
        const entry = convert(
            watch(null, { status }, ANIME, { new_watch: true }),
        );

        expect(lines(entry)).toEqual([text]);
        expect(entry.icon).toEqual({ kind: 'status', status });
    });

    it.each([
        ['planned', 'watching', 'Перенесено із Заплановано в Дивлюсь'],
        ['planned', 'on_hold', 'Перенесено із Заплановано у Відкладено'],
        ['watching', 'completed', 'Перенесено з Дивлюсь в Завершено'],
        ['on_hold', 'dropped', 'Перенесено з Відкладено в Закинуто'],
        ['completed', 'planned', 'Перенесено із Завершено в Заплановано'],
    ])('moves an entry from %s to %s', (from, to, text) => {
        const entry = convert(watch({ status: from }, { status: to }));

        expect(lines(entry)).toEqual([text]);
        expect(entry.icon).toEqual({ kind: 'status', status: to });
    });

    it('uses "із" before Ч for reading', () => {
        expect(
            lines(convert(read({ status: 'reading' }, { status: 'dropped' }))),
        ).toEqual(['Перенесено із Читаю в Закинуто']);
    });

    it('styles only the new status as a status word', () => {
        const [first] = convert(
            watch({ status: 'planned' }, { status: 'watching' }),
        ).facts;

        expect(first.filter((part) => part.type === 'status')).toEqual([
            { type: 'status', text: 'Дивлюсь' },
        ]);
    });

    it('treats a missing before status as a new entry', () => {
        expect(lines(convert(watch(null, { status: 'planned' })))).toEqual([
            'Додано в Заплановано',
        ]);
    });
});

describe('convertHistory: deletes', () => {
    it.each([
        HistoryTypeEnum.WATCH_DELETE,
        HistoryTypeEnum.READ_MANGA_DELETE,
        HistoryTypeEnum.READ_NOVEL_DELETE,
    ])('deletes from the list on %s', (type) => {
        const entry = convert(history(type, {}));

        expect(lines(entry)).toEqual(['Видалено зі списку']);
        expect(entry.icon).toEqual({ kind: 'delete' });
    });

    it('reads a cleared status as a delete', () => {
        const entry = convert(watch({ status: 'watching' }, { status: null }));

        expect(lines(entry)).toEqual(['Видалено зі списку']);
        expect(entry.icon).toEqual({ kind: 'delete' });
    });
});

describe('convertHistory: progress', () => {
    it('watches one episode', () => {
        const entry = convert(watch({ episodes: 10 }, { episodes: 11 }));

        expect(lines(entry)).toEqual(['Переглянуто епізод 11 з 28']);
        expect(entry.icon).toEqual({ kind: 'progress' });
    });

    it('watches a range of episodes', () => {
        expect(lines(convert(watch({ episodes: 3 }, { episodes: 5 })))).toEqual(
            ['Переглянуто епізоди 4–5 з 28'],
        );
    });

    it('starts the range at 1 from zero or null', () => {
        expect(lines(convert(watch({ episodes: 0 }, { episodes: 5 })))).toEqual(
            ['Переглянуто епізоди 1–5 з 28'],
        );
        expect(
            lines(convert(watch({ episodes: null }, { episodes: 5 }))),
        ).toEqual(['Переглянуто епізоди 1–5 з 28']);
    });

    it('drops the total when it is unknown', () => {
        expect(
            lines(convert(watch({ episodes: 8 }, { episodes: 9 }, NO_TOTAL))),
        ).toEqual(['Переглянуто епізод 9']);
    });

    it('rolls progress back', () => {
        const entry = convert(watch({ episodes: 12 }, { episodes: 10 }));

        expect(lines(entry)).toEqual(['Прогрес повернуто з 12 до 10 епізодів']);
        expect(entry.icon).toEqual({ kind: 'rollback' });
    });

    it('declines the rollback target as a count', () => {
        expect(lines(convert(watch({ episodes: 3 }, { episodes: 1 })))).toEqual(
            ['Прогрес повернуто з 3 до 1 епізоду'],
        );
        expect(
            lines(convert(watch({ episodes: 24 }, { episodes: 21 }))),
        ).toEqual(['Прогрес повернуто з 24 до 21 епізоду']);
        expect(lines(convert(read({ volumes: 5 }, { volumes: 2 })))).toEqual([
            'Прогрес повернуто з 5 до 2 томів',
        ]);
    });

    it('skips progress reset to zero', () => {
        const entry = convert(watch({ episodes: 12 }, { episodes: 0 }));

        expect(lines(entry)).toEqual(['Запис оновлено']);
        expect(entry.icon).toEqual({ kind: 'updated' });
    });

    it('declines the count of a new entry', () => {
        expect(
            lines(
                convert(
                    watch(
                        null,
                        { status: 'completed', episodes: 3, score: 7 },
                        NO_TOTAL,
                        { new_watch: true },
                    ),
                ),
            ),
        ).toEqual(['Завершено', 'переглянуто 3 епізоди', 'оцінка 7']);
        expect(
            lines(
                convert(
                    watch(null, { status: 'watching', episodes: 5 }, ANIME, {
                        new_watch: true,
                    }),
                ),
            ),
        ).toEqual(['Дивлюсь', 'переглянуто 5 епізодів з 28']);
    });

    it('says "всі" when a completed entry reaches the total', () => {
        expect(
            lines(
                convert(
                    watch(
                        null,
                        { status: 'completed', episodes: 24 },
                        { data_type: 'anime', episodes_total: 24 },
                        { new_watch: true },
                    ),
                ),
            ),
        ).toEqual(['Завершено', 'переглянуто всі 24 епізоди']);
        expect(
            lines(
                convert(
                    watch(
                        { status: 'planned', episodes: 0 },
                        { status: 'completed', episodes: 12 },
                        { data_type: 'anime', episodes_total: 12 },
                    ),
                ),
            ),
        ).toEqual([
            'Перенесено із Заплановано в Завершено',
            'переглянуто всі 12 епізодів',
        ]);
    });

    it('skips the count of a completed single-episode title', () => {
        expect(
            lines(
                convert(
                    watch(
                        null,
                        { status: 'completed', episodes: 1 },
                        { data_type: 'anime', episodes_total: 1 },
                        { new_watch: true },
                    ),
                ),
            ),
        ).toEqual(['Додано в Завершено']);
    });

    it('keeps the verb after a status change', () => {
        expect(
            lines(
                convert(
                    read(
                        { status: 'planned', chapters: 0 },
                        { status: 'reading', chapters: 5 },
                        NO_CHAPTERS,
                    ),
                ),
            ),
        ).toEqual([
            'Перенесено із Заплановано в Читаю',
            'прочитано розділи 1–5',
        ]);
    });

    it('reads chapters and volumes', () => {
        expect(
            lines(convert(read({ chapters: 16 }, { chapters: 22 }))),
        ).toEqual(['Прочитано розділи 17–22 з 327']);
        expect(
            lines(convert(read({ chapters: 8 }, { chapters: 9 }, NO_CHAPTERS))),
        ).toEqual(['Прочитано розділ 9']);
        expect(lines(convert(read({ volumes: 1 }, { volumes: 3 })))).toEqual([
            'Прочитано томи 2–3 з 37',
        ]);
        expect(lines(convert(read({ chapters: 10 }, { chapters: 8 })))).toEqual(
            ['Прогрес повернуто з 10 до 8 розділів'],
        );
    });

    it('joins chapters and volumes of a new entry into one fact', () => {
        expect(
            lines(
                convert(
                    read(
                        null,
                        {
                            status: 'planned',
                            chapters: 20,
                            volumes: 3,
                            score: 8,
                            rereads: 1,
                        },
                        NO_CHAPTERS,
                        { new_read: true },
                    ),
                ),
            ),
        ).toEqual([
            'Заплановано',
            'прочитано 20 розділів, 3 томи',
            'оцінка 8',
            'перечитано 1 раз',
        ]);
    });
});

describe('convertHistory: score', () => {
    it('scores an entry', () => {
        const entry = convert(watch({ score: 0 }, { score: 8 }));

        expect(lines(entry)).toEqual(['Оцінка 8']);
        expect(entry.icon).toEqual({ kind: 'score' });
    });

    it('changes a score', () => {
        expect(lines(convert(watch({ score: 6 }, { score: 8 })))).toEqual([
            'Оцінку змінено з 6 на 8',
        ]);
    });

    it('removes a score', () => {
        expect(lines(convert(watch({ score: 8 }, { score: 0 })))).toEqual([
            'Оцінку 8 прибрано',
        ]);
        expect(lines(convert(watch({ score: 8 }, { score: null })))).toEqual([
            'Оцінку 8 прибрано',
        ]);
    });

    it('skips a zero score on a new entry', () => {
        expect(
            lines(
                convert(
                    watch(null, { status: 'planned', score: 0 }, ANIME, {
                        new_watch: true,
                    }),
                ),
            ),
        ).toEqual(['Додано в Заплановано']);
    });
});

describe('convertHistory: repeats', () => {
    it('marks the first rewatch', () => {
        expect(
            lines(
                convert(
                    watch(
                        { episodes: 0, score: 0, rewatches: 0 },
                        { episodes: 5, score: 7, rewatches: 1 },
                        { data_type: 'anime', episodes_total: 37 },
                    ),
                ),
            ),
        ).toEqual([
            'Переглянуто епізоди 1–5 з 37',
            'оцінка 7',
            'повторний перегляд',
        ]);
    });

    it('counts later rewatches and rereads', () => {
        expect(
            lines(convert(watch({ rewatches: 1 }, { rewatches: 2 }))),
        ).toEqual(['Переглянуто повторно 2 рази']);
        expect(lines(convert(read({ rereads: 4 }, { rereads: 5 })))).toEqual([
            'Перечитано 5 разів',
        ]);
    });
});

describe('convertHistory: dates', () => {
    it('sets and changes dates', () => {
        const entry = convert(
            watch({ start_date: null }, { start_date: MAY_28 }),
        );

        expect(lines(entry)).toEqual(['Почато 28 травня']);
        expect(entry.icon).toEqual({ kind: 'date' });
        expect(
            lines(
                convert(watch({ start_date: MAY_17 }, { start_date: MAY_28 })),
            ),
        ).toEqual(['Почато 28 травня']);
        expect(
            lines(convert(watch({ end_date: null }, { end_date: JUNE_3 }))),
        ).toEqual(['Закінчено 3 червня']);
    });

    it('removes dates', () => {
        expect(
            lines(convert(watch({ start_date: MAY_28 }, { start_date: null }))),
        ).toEqual(['Дату початку прибрано']);
        expect(
            lines(convert(watch({ end_date: MAY_28 }, { end_date: null }))),
        ).toEqual(['Дату закінчення прибрано']);
    });

    it('skips a date the status change set on the same day', () => {
        expect(
            lines(
                convert(
                    watch(
                        { status: 'watching', end_date: null },
                        { status: 'completed', end_date: MAY_28 },
                    ),
                ),
            ),
        ).toEqual(['Перенесено з Дивлюсь в Завершено']);
        expect(
            lines(
                convert(
                    read(
                        { status: 'planned', start_date: null },
                        { status: 'reading', start_date: MAY_28 },
                    ),
                ),
            ),
        ).toEqual(['Перенесено із Заплановано в Читаю']);
    });

    it('keeps a date the status change set on another day', () => {
        expect(
            lines(
                convert(
                    watch(
                        { status: 'watching', end_date: null },
                        { status: 'completed', end_date: MAY_17 },
                    ),
                ),
            ),
        ).toEqual(['Перенесено з Дивлюсь в Завершено', 'закінчено 17 травня']);
    });

    it('ignores the start date a new entry sets on its own', () => {
        expect(
            lines(
                convert(
                    watch(
                        null,
                        { status: 'watching', start_date: MAY_28 },
                        ANIME,
                        { new_watch: true },
                    ),
                ),
            ),
        ).toEqual(['Додано в Дивлюсь']);
    });

    it('combines rollback, score removal and a date', () => {
        expect(
            lines(
                convert(
                    watch(
                        { episodes: 12, score: 8, start_date: null },
                        { episodes: 10, score: 0, start_date: MAY_28 },
                    ),
                ),
            ),
        ).toEqual([
            'Прогрес повернуто з 12 до 10 епізодів',
            'оцінку 8 прибрано',
            'почато 28 травня',
        ]);
    });
});

describe('convertHistory: no change', () => {
    it('reports an update when before equals after', () => {
        const entry = convert(
            watch(
                { status: 'watching', episodes: 3, score: 5 },
                { status: 'watching', episodes: 3, score: 5 },
            ),
        );

        expect(lines(entry)).toEqual(['Запис оновлено']);
        expect(entry.icon).toEqual({ kind: 'updated' });
    });
});

describe('convertHistory: import', () => {
    it('imports anime', () => {
        const entry = convert(
            history(HistoryTypeEnum.WATCH_IMPORT, { imported: 128 }, null),
        );

        expect(lines(entry)).toEqual(['Додано 128 аніме до списку']);
        expect(entry.icon).toEqual({ kind: 'import' });
        expect(entry.medium).toBe('watch');
    });

    it('adds the overwrite fact', () => {
        expect(
            lines(
                convert(
                    history(
                        HistoryTypeEnum.WATCH_IMPORT,
                        { imported: 128, overwrite: true },
                        null,
                    ),
                ),
            ),
        ).toEqual(['Додано 128 аніме до списку', 'наявні записи замінено']);
    });

    it('imports manga and novels, skipping a zero part', () => {
        const readImport = (data: Record<string, unknown>) =>
            lines(convert(history(HistoryTypeEnum.READ_IMPORT, data, null)));

        expect(readImport({ imported_manga: 42, imported_novel: 7 })).toEqual([
            'Додано 42 манґи та 7 ранобе',
        ]);
        expect(readImport({ imported_manga: 42, imported_novel: 0 })).toEqual([
            'Додано 42 манґи',
        ]);
        expect(readImport({ imported_manga: 0, imported_novel: 7 })).toEqual([
            'Додано 7 ранобе',
        ]);
        expect(readImport({ imported_manga: 1, imported_novel: 0 })).toEqual([
            'Додано 1 манґу',
        ]);
        expect(readImport({ imported_manga: 5, imported_novel: 2 })).toEqual([
            'Додано 5 манґ та 2 ранобе',
        ]);
    });
});

describe('convertHistory: favourites', () => {
    it.each([
        HistoryTypeEnum.FAVOURITE_ANIME_ADD,
        HistoryTypeEnum.FAVOURITE_MANGA_ADD,
        HistoryTypeEnum.FAVOURITE_NOVEL_ADD,
    ])('adds to favourites on %s', (type) => {
        const entry = convert(history(type, {}));

        expect(lines(entry)).toEqual(['Додано в Улюблене']);
        expect(entry.icon).toEqual({ kind: 'favourite-add' });
    });

    it.each([
        HistoryTypeEnum.FAVOURITE_ANIME_REMOVE,
        HistoryTypeEnum.FAVOURITE_MANGA_REMOVE,
        HistoryTypeEnum.FAVOURITE_NOVEL_REMOVE,
    ])('removes from favourites on %s', (type) => {
        const entry = convert(history(type, {}));

        expect(lines(entry)).toEqual(['Прибрано з улюбленого']);
        expect(entry.icon).toEqual({ kind: 'favourite-remove' });
    });

    it('picks the medium from the history type', () => {
        expect(
            convert(history(HistoryTypeEnum.FAVOURITE_ANIME_ADD, {})).medium,
        ).toBe('watch');
        expect(
            convert(history(HistoryTypeEnum.FAVOURITE_NOVEL_ADD, {})).medium,
        ).toBe('read');
    });
});

describe('convertHistory: typography', () => {
    it('capitalises only the first fact', () => {
        const [first, ...rest] = lines(
            convert(
                watch({ score: 6, episodes: 1 }, { score: 8, episodes: 2 }),
            ),
        );

        expect(first).toBe('Переглянуто епізод 2 з 28');
        expect(rest).toEqual(['оцінку змінено з 6 на 8']);
    });

    it('binds numbers and short prepositions to the next word', () => {
        const [progress] = convert(
            watch({ episodes: 12 }, { episodes: 10 }),
        ).facts;

        expect(progress.map((part) => part.text).join('')).toBe(
            'Прогрес повернуто з\u00A012\u00A0до\u00A010\u00A0епізодів',
        );
        expect(progress.filter((part) => part.type === 'value')).toEqual([
            { type: 'value', text: '12' },
            { type: 'value', text: '10' },
        ]);
    });

    it('keeps the total and "з" together', () => {
        const [progress] = convert(
            watch({ episodes: 10 }, { episodes: 11 }),
        ).facts;

        expect(progress.map((part) => part.text).join('')).toBe(
            'Переглянуто епізод 11\u00A0з\u00A028',
        );
    });
});
