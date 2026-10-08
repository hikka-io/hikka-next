import { describe, expect, it } from 'vitest';

import { getDeclensionWord } from './declension';
import {
    CHAPTER_FORMS,
    COMMENT_FORMS,
    DAY_FORMS,
    EPISODE_FORMS,
    HOUR_FORMS,
    MONTH_FORMS,
    REPLY_FORMS,
    REREAD_FORMS,
    SYMBOL_FORMS,
    TIMES_FORMS,
    VIEW_FORMS,
    VOLUME_FORMS,
} from './word-forms';

describe('word forms', () => {
    it.each([
        ['EPISODE_FORMS', EPISODE_FORMS, ['епізод', 'епізоди', 'епізодів']],
        ['CHAPTER_FORMS', CHAPTER_FORMS, ['розділ', 'розділи', 'розділів']],
        ['VOLUME_FORMS', VOLUME_FORMS, ['том', 'томи', 'томів']],
        ['TIMES_FORMS', TIMES_FORMS, ['раз', 'рази', 'разів']],
        [
            'COMMENT_FORMS',
            COMMENT_FORMS,
            ['коментар', 'коментарі', 'коментарів'],
        ],
        ['REPLY_FORMS', REPLY_FORMS, ['відповідь', 'відповіді', 'відповідей']],
        ['MONTH_FORMS', MONTH_FORMS, ['місяць', 'місяці', 'місяців']],
        ['DAY_FORMS', DAY_FORMS, ['день', 'дні', 'днів']],
        ['HOUR_FORMS', HOUR_FORMS, ['година', 'години', 'годин']],
        ['SYMBOL_FORMS', SYMBOL_FORMS, ['символ', 'символи', 'символів']],
        ['VIEW_FORMS', VIEW_FORMS, ['перегляд', 'перегляди', 'переглядів']],
        [
            'REREAD_FORMS',
            REREAD_FORMS,
            ['перечитування', 'перечитування', 'перечитувань'],
        ],
    ])('%s keeps its exact forms', (_name, forms, expected) => {
        expect(forms).toEqual(expected);
    });

    it('picks the form by the Ukrainian plural rule', () => {
        expect(
            [1, 2, 5, 11, 12, 21, 22, 25, 111].map(
                (n) => `${n} ${getDeclensionWord(n, EPISODE_FORMS)}`,
            ),
        ).toEqual([
            '1 епізод',
            '2 епізоди',
            '5 епізодів',
            '11 епізодів',
            '12 епізодів',
            '21 епізод',
            '22 епізоди',
            '25 епізодів',
            '111 епізодів',
        ]);
    });

    it('declines rereads by the Ukrainian plural rule', () => {
        expect(
            [1, 2, 5, 11, 21].map(
                (n) => `${n} ${getDeclensionWord(n, REREAD_FORMS)}`,
            ),
        ).toEqual([
            '1 перечитування',
            '2 перечитування',
            '5 перечитувань',
            '11 перечитувань',
            '21 перечитування',
        ]);
    });
});
