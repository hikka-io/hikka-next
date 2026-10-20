import { describe, expect, it } from 'vitest';

import { API_LIMITS } from '@hikka/api';

import {
    emailSchema,
    invalidUsernameCharacters,
    matchFields,
    passwordSchema,
    USERNAME_HINT,
    userLinkTextSchema,
    userLinkUrlSchema,
    usernameSchema,
} from './auth-schemas';

const messages = (
    schema: {
        safeParse: (value: unknown) => {
            success: boolean;
            error?: { issues: { message: string }[] };
        };
    },
    value: string,
) => {
    const result = schema.safeParse(value);
    return result.success ? [] : result.error?.issues.map((i) => i.message);
};

describe('usernameSchema', () => {
    it('accepts what the API pattern accepts', () => {
        expect(messages(usernameSchema, 'hikka')).toEqual([]);
        expect(messages(usernameSchema, 'a_1234')).toEqual([]);
        expect(
            messages(usernameSchema, 'a'.repeat(API_LIMITS.username.max)),
        ).toEqual([]);
    });

    it.each([
        ['', 'Вкажіть нікнейм'],
        ['abc', 'Щонайменше 5 символів'],
        ['1abcde', 'Має починатися з літери'],
        ['a'.repeat(API_LIMITS.username.max + 1), 'Не більше 64 символів'],
        ['ab cde', 'Недопустимий символ: пробіл'],
        ['abcdé', 'Недопустимий символ: «é»'],
        ['ab-c@d', 'Недопустимі символи: «-», «@»'],
    ])('rejects %j with %j', (value, message) => {
        expect(messages(usernameSchema, value)).toEqual([message]);
    });

    it('lists at most three offending characters', () => {
        expect(messages(usernameSchema, 'a!@#$%')).toEqual([
            'Недопустимі символи: «!», «@», «#»…',
        ]);
    });

    it('mentions the limits in the hint', () => {
        expect(USERNAME_HINT).toContain('від 5 до 64');
        expect(invalidUsernameCharacters('a-b-c d')).toEqual(['-', ' ']);
    });
});

describe('emailSchema', () => {
    it('accepts a plain address', () => {
        expect(messages(emailSchema, 'user@example.com')).toEqual([]);
    });

    it.each([
        ['', 'Вкажіть email'],
        ['not-an-email', 'Некоректний email'],
        ['user+tag@example.com', 'Адреси з «+» не підтримуються'],
    ])('rejects %j', (value, message) => {
        expect(messages(emailSchema, value)).toEqual([message]);
    });
});

describe('passwordSchema', () => {
    it('follows the API bounds', () => {
        expect(messages(passwordSchema, 'x'.repeat(7))).toEqual([
            'Щонайменше 8 символів',
        ]);
        expect(messages(passwordSchema, 'x'.repeat(8))).toEqual([]);
        expect(messages(passwordSchema, 'x'.repeat(257))).toEqual([
            'Не більше 256 символів',
        ]);
    });
});

describe('matchFields', () => {
    const [check, issue] = matchFields('password', 'confirm', 'no match');

    it('compares the two fields and reports on the confirmation', () => {
        expect(check({ password: 'a', confirm: 'a' })).toBe(true);
        expect(check({ password: 'a', confirm: 'b' })).toBe(false);
        expect(issue).toEqual({ message: 'no match', path: ['confirm'] });
    });
});

describe('userLinkUrlSchema', () => {
    it.each([
        ['', 'Вкажіть посилання'],
        ['github.com/hikka', 'Посилання має починатися з https://'],
        ['javascript:alert(1)', 'Посилання має починатися з https://'],
    ])('rejects %j', (value, message) => {
        expect(messages(userLinkUrlSchema, value)).toEqual([message]);
    });

    it('accepts an http(s) link and trims it', () => {
        expect(messages(userLinkUrlSchema, '  https://t.me/hikka ')).toEqual(
            [],
        );
    });
});

describe('userLinkTextSchema', () => {
    it('follows the API bound', () => {
        const { max } = API_LIMITS.userLinkText;

        expect(messages(userLinkTextSchema, 'x'.repeat(max))).toEqual([]);
        expect(messages(userLinkTextSchema, 'x'.repeat(max + 1))).toEqual([
            `Не більше ${max} символів`,
        ]);
    });
});
