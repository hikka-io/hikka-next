import { describe, expect, it } from 'vitest';

import { API_LIMITS } from '@hikka/api';

import {
    clientDescriptionSchema,
    clientNameSchema,
    emailSchema,
    endpointSchema,
    invalidUsernameCharacters,
    passwordSchema,
    suggestEndpoint,
    USERNAME_HINT,
    usernameSchema,
} from './form-schemas';

const messages = (
    schema: {
        safeParse: (v: unknown) => { success: boolean; error?: unknown };
    },
    value: string,
) => {
    const result = schema.safeParse(value) as {
        success: boolean;
        error?: { issues: { message: string }[] };
    };

    return result.success
        ? []
        : (result.error?.issues ?? []).map((i) => i.message);
};

// The backend pattern, verbatim from hikka-io/hikka app/schemas.py
// (UsernameArgs). The client schema must agree with it on every input.
const BACKEND_USERNAME = /^[A-Za-z][A-Za-z0-9_]{4,63}$/;

describe('usernameSchema', () => {
    const samples = [
        '',
        'a',
        'abcd',
        'abcde',
        'hikka',
        'Hikka_2024',
        'a'.repeat(64),
        'a'.repeat(65),
        '_hikka',
        '1hikka',
        'хікка',
        'hikka.io',
        'hikka-io',
        'hikka io',
        'hikkaї',
        'ab_c1',
        'Z____',
    ];

    it.each(samples)('agrees with the backend pattern on %j', (value) => {
        expect(usernameSchema.safeParse(value).success).toBe(
            BACKEND_USERNAME.test(value),
        );
    });

    it('reports exactly one message at a time', () => {
        for (const value of samples) {
            expect(messages(usernameSchema, value).length).toBeLessThanOrEqual(
                1,
            );
        }
    });

    it('names the offending characters before anything else', () => {
        expect(messages(usernameSchema, 'хі')).toEqual([
            'Недопустимі символи: «х», «і»',
        ]);
        expect(messages(usernameSchema, 'hikka io')).toEqual([
            'Недопустимий символ: пробіл',
        ]);
        expect(messages(usernameSchema, 'олександр')).toEqual([
            'Недопустимі символи: «о», «л», «е»…',
        ]);
        expect(invalidUsernameCharacters('a.b.c-d')).toEqual(['.', '-']);
    });

    it('explains the first-letter rule and the length', () => {
        expect(messages(usernameSchema, '_hikka')).toEqual([
            'Має починатися з літери',
        ]);
        expect(messages(usernameSchema, 'abc')).toEqual([
            'Щонайменше 5 символів',
        ]);
        expect(messages(usernameSchema, 'a'.repeat(65))).toEqual([
            'Не більше 64 символів',
        ]);
        expect(messages(usernameSchema, '')).toEqual(['Вкажіть нікнейм']);
    });
});

describe('emailSchema', () => {
    it('accepts an ordinary address', () => {
        expect(messages(emailSchema, 'hikka@email.com')).toEqual([]);
    });

    it('refuses a plus sign, as EmailArgs.check_email does', () => {
        expect(messages(emailSchema, 'name+tag@email.com')).toEqual([
            'Адреси з «+» не підтримуються',
        ]);
    });

    it('asks for the address when it is empty or malformed', () => {
        expect(messages(emailSchema, '')).toEqual(['Вкажіть email']);
        expect(messages(emailSchema, 'hikka@')).toEqual(['Некоректний email']);
    });
});

describe('passwordSchema', () => {
    it.each([
        ['1234567', false],
        ['12345678', true],
        ['x'.repeat(256), true],
        ['x'.repeat(257), false],
    ])('%j -> %s (PasswordArgs: 8..256)', (value, ok) => {
        expect(passwordSchema.safeParse(value).success).toBe(ok);
    });
});

describe('client name and description', () => {
    it('ignore the invisible characters the API strips', () => {
        expect(clientNameSchema.safeParse('\u2800ab\ufff4').success).toBe(
            false,
        );
        expect(clientNameSchema.safeParse('\u2800abc').success).toBe(true);
    });

    it('count characters after trimming, like the API does', () => {
        expect(clientNameSchema.safeParse('  ab  ').success).toBe(false);
        expect(clientNameSchema.safeParse(' abc ').success).toBe(true);
        expect(clientDescriptionSchema.safeParse('x'.repeat(512)).success).toBe(
            true,
        );
        expect(clientDescriptionSchema.safeParse('x'.repeat(513)).success).toBe(
            false,
        );
    });
});

describe('endpointSchema', () => {
    // The examples the API documents for ClientCreate.endpoint.
    it.each([
        'https://example.com',
        'http://localhost/auth/confirm',
        'hikka://auth',
    ])('accepts %j', (value) => {
        expect(messages(endpointSchema, value)).toEqual([]);
    });

    it.each([
        ' https://example.com/cb ',
        'https://example.com/a b',
    ])('accepts %j, which the API normalises', (value) => {
        expect(messages(endpointSchema, value)).toEqual([]);
    });

    it.each([
        '/auth/confirm',
        'callback',
        'http://',
        'https://exa mple.com',
    ])('rejects %j before the API answers "Invalid field endpoint"', (value) => {
        expect(messages(endpointSchema, value)).toEqual([
            'Потрібне повне посилання: https://… або myapp://…',
        ]);
    });

    it.each([
        ['example.com', 'https://example.com'],
        ['hikka.io/oauth/callback', 'https://hikka.io/oauth/callback'],
        [
            'sub.example.co.uk:8443/cb?x=1',
            'https://sub.example.co.uk:8443/cb?x=1',
        ],
        ['хікка.укр/вхід', 'https://хікка.укр/вхід'],
        // Valid URLs with the scheme "localhost" / not URLs at all — a dev
        // server, so plain http.
        ['localhost:3000/callback', 'http://localhost:3000/callback'],
        ['app.localhost:5173', 'http://app.localhost:5173'],
        ['127.0.0.1:8080/cb', 'http://127.0.0.1:8080/cb'],
        ['192.168.1.20/cb', 'http://192.168.1.20/cb'],
    ])('suggests the missing scheme for %j', (value, suggestion) => {
        expect(suggestEndpoint(value)).toBe(suggestion);
        expect(messages(endpointSchema, value)).toEqual([
            `Додайте схему: ${suggestion}`,
        ]);
    });

    it.each([
        ['[::1]:3000/callback', 'http://[::1]:3000/callback'],
        ['[fd12:3456::1]/cb', 'http://[fd12:3456::1]/cb'],
        ['169.254.10.20/cb', 'http://169.254.10.20/cb'],
        ['172.20.0.5:8080', 'http://172.20.0.5:8080'],
    ])('treats %j as a local host', (value, suggestion) => {
        expect(suggestEndpoint(value)).toBe(suggestion);
    });

    it.each([
        '192.168.999.999/cb',
        '10.0.0/cb',
        '172.32.0.1.5/cb',
    ])('does not suggest an invalid address for %j', (value) => {
        expect(suggestEndpoint(value)).toBeNull();
        expect(messages(endpointSchema, value)).toEqual([
            'Потрібне повне посилання: https://… або myapp://…',
        ]);
    });

    it.each([
        'myapp:auth',
        'hikka://auth',
        '/auth/confirm',
        'v1.2',
        'callback',
        '[fc::1]/cb',
        '[fe8::1]/cb',
    ])('does not guess a scheme for %j', (value) => {
        expect(suggestEndpoint(value)).toBeNull();
    });

    it('measures the normalised address, as str(AnyUrl) does', () => {
        const withPath = `https://example.com/${'a'.repeat(108)}`;
        expect(withPath.length).toBe(128);
        expect(messages(endpointSchema, withPath)).toEqual([]);

        // 128 characters as typed, but a bare origin gains a trailing slash
        // in both URL.href and str(AnyUrl) — and that one does not fit.
        const bareOrigin = `https://${'a'.repeat(60)}.${'b'.repeat(55)}.com`;
        expect(bareOrigin.length).toBe(128);
        expect(messages(endpointSchema, bareOrigin)).toEqual([
            'Не більше 128 символів (зараз 129)',
        ]);
    });

    it('asks for an address when the field is empty', () => {
        expect(messages(endpointSchema, '  ')).toEqual(['Вкажіть посилання']);
    });
});

describe('bounds follow API_LIMITS', () => {
    it('the backend username pattern carries API_LIMITS.username', () => {
        const { min, max } = API_LIMITS.username;

        expect(BACKEND_USERNAME.source).toBe(
            `^[A-Za-z][A-Za-z0-9_]{${min - 1},${max - 1}}$`,
        );
    });

    it.each([
        ['usernameSchema', usernameSchema, API_LIMITS.username, 'a'],
        ['passwordSchema', passwordSchema, API_LIMITS.password, 'x'],
        ['clientNameSchema', clientNameSchema, API_LIMITS.clientName, 'x'],
        [
            'clientDescriptionSchema',
            clientDescriptionSchema,
            API_LIMITS.clientDescription,
            'x',
        ],
    ] as const)('%s accepts exactly min..max characters', (_, schema, limits, char) => {
        expect(schema.safeParse(char.repeat(limits.min - 1)).success).toBe(
            false,
        );
        expect(schema.safeParse(char.repeat(limits.min)).success).toBe(true);
        expect(schema.safeParse(char.repeat(limits.max)).success).toBe(true);
        expect(schema.safeParse(char.repeat(limits.max + 1)).success).toBe(
            false,
        );
    });

    it('states the bounds in the same words', () => {
        expect(USERNAME_HINT).toBe(
            'Латинські літери, цифри та _, від 5 до 64 символів',
        );
        expect(messages(passwordSchema, 'x'.repeat(7))).toEqual([
            'Щонайменше 8 символів',
        ]);
        expect(messages(passwordSchema, 'x'.repeat(257))).toEqual([
            'Не більше 256 символів',
        ]);
        expect(messages(clientNameSchema, 'xx')).toEqual([
            'Щонайменше 3 символи',
        ]);
        expect(messages(clientDescriptionSchema, 'x'.repeat(513))).toEqual([
            'Не більше 512 символів',
        ]);
    });
});
