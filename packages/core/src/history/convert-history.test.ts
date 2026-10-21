import { describe, expect, it } from 'vitest';

import { type HistoryResponse, HistoryTypeEnum } from '@hikka/api';

import { convertHistory } from './convert-history';
import type { HistoryEntry } from './types';

const MAY_28 = Date.UTC(2025, 4, 28, 12) / 1000;
const MAY_17 = Date.UTC(2025, 4, 17, 12) / 1000;

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

const convert = (item: HistoryResponse) => convertHistory(item);

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
        ['planned', 'watching', 'Дивлюсь'],
        ['planned', 'on_hold', 'Відкладено'],
        ['watching', 'completed', 'Завершено'],
        ['on_hold', 'dropped', 'Закинуто'],
        ['completed', 'planned', 'Заплановано'],
    ])(
        'names only the new status when moving from %s to %s',
        (from, to, text) => {
            const entry = convert(watch({ status: from }, { status: to }));

            expect(lines(entry)).toEqual([text]);
            expect(entry.icon).toEqual({ kind: 'status', status: to });
        },
    );

    it('styles the new status as a status word', () => {
        const [first] = convert(
            watch({ status: 'planned' }, { status: 'watching' }),
        ).facts;

        expect(first).toEqual([{ type: 'status', text: 'Дивлюсь' }]);
    });

    it('starts watching with the first episode', () => {
        expect(
            lines(
                convert(
                    watch(
                        { status: 'planned', episodes: 0 },
                        { status: 'watching', episodes: 1 },
                        { data_type: 'anime', episodes_total: 16 },
                    ),
                ),
            ),
        ).toEqual(['Дивлюсь', 'переглянуто епізод 1 з 16']);
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

        expect(lines(entry)).toEqual(['Повернуто до епізоду 10']);
        expect(entry.icon).toEqual({ kind: 'rollback' });
    });

    it('names the unit of the rollback target', () => {
        expect(lines(convert(read({ volumes: 5 }, { volumes: 2 })))).toEqual([
            'Повернуто до тому 2',
        ]);
    });

    it('resets progress to zero', () => {
        const entry = convert(watch({ episodes: 12 }, { episodes: 0 }));

        expect(lines(entry)).toEqual(['Прогрес скинуто']);
        expect(entry.icon).toEqual({ kind: 'rollback' });
    });

    it('reports one reset for chapters and volumes', () => {
        expect(
            lines(
                convert(
                    read(
                        { status: 'completed', chapters: 30, volumes: 3 },
                        { status: 'planned', chapters: 0, volumes: 0 },
                    ),
                ),
            ),
        ).toEqual(['Заплановано', 'прогрес скинуто']);
    });

    it('leaves the reset implied by a repeat', () => {
        expect(
            lines(
                convert(
                    watch(
                        { status: 'completed', episodes: 12, rewatches: 0 },
                        { status: 'watching', episodes: 0, rewatches: 1 },
                    ),
                ),
            ),
        ).toEqual(['Дивлюсь', 'повторний перегляд']);
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

    it('drops the progress a completion implies', () => {
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
        ).toEqual(['Додано в Завершено']);
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
        ).toEqual(['Завершено']);
    });

    it('keeps progress below the total on completion', () => {
        expect(
            lines(
                convert(
                    watch(
                        { status: 'watching', episodes: 10 },
                        { status: 'completed', episodes: 11 },
                    ),
                ),
            ),
        ).toEqual(['Завершено', 'переглянуто епізод 11 з 28']);
    });

    it('keeps progress reaching the total on an already completed entry', () => {
        expect(
            lines(
                convert(
                    watch(
                        { status: 'completed', episodes: 26 },
                        { status: 'completed', episodes: 28 },
                    ),
                ),
            ),
        ).toEqual(['Переглянуто епізоди 27–28 з 28']);
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
        ).toEqual(['Читаю', 'прочитано розділи 1–5']);
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
            ['Повернуто до розділу 8'],
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
            'Оцінка 6 → 8',
        ]);
    });

    it('removes a score', () => {
        expect(lines(convert(watch({ score: 8 }, { score: 0 })))).toEqual([
            'Оцінку прибрано',
        ]);
        expect(lines(convert(watch({ score: 8 }, { score: null })))).toEqual([
            'Оцінку прибрано',
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
    it('reports a date-only change as an update', () => {
        const entry = convert(
            watch(
                { start_date: null, end_date: MAY_17 },
                { start_date: MAY_28, end_date: null },
            ),
        );

        expect(lines(entry)).toEqual(['Запис оновлено']);
        expect(entry.icon).toEqual({ kind: 'updated' });
    });

    it('leaves dates out of other changes', () => {
        expect(
            lines(
                convert(
                    watch(
                        { status: 'watching', end_date: null },
                        { status: 'completed', end_date: MAY_17 },
                    ),
                ),
            ),
        ).toEqual(['Завершено']);
        expect(
            lines(
                convert(
                    watch(
                        { episodes: 12, score: 8, start_date: null },
                        { episodes: 10, score: 0, start_date: MAY_28 },
                    ),
                ),
            ),
        ).toEqual(['Повернуто до епізоду 10', 'оцінку прибрано']);
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
        expect(rest).toEqual(['оцінка 6 → 8']);
    });

    it('binds numbers and short prepositions to the next word', () => {
        const [progress] = convert(
            watch({ episodes: 12 }, { episodes: 10 }),
        ).facts;

        expect(progress.map((part) => part.text).join('')).toBe(
            'Повернуто до\u00A0епізоду\u00A010',
        );
        expect(progress.filter((part) => part.type === 'value')).toEqual([
            { type: 'value', text: '10' },
        ]);
    });

    it('keeps both scores and the arrow together', () => {
        const [score] = convert(watch({ score: 6 }, { score: 8 })).facts;

        expect(score.map((part) => part.text).join('')).toBe(
            'Оцінка 6\u00A0→\u00A08',
        );
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
