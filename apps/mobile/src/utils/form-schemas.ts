import { z } from 'zod';

import { API_LIMITS } from '@hikka/api';

// Mirrors apps/web/src/utils/form-schemas.ts until shared utils move into a package.

const SYMBOL_FORMS = ['символ', 'символи', 'символів'] as const;

const symbols = (count: number) => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastDigit === 1 && lastTwoDigits !== 11) return SYMBOL_FORMS[0];
    if (
        lastDigit >= 2 &&
        lastDigit <= 4 &&
        (lastTwoDigits < 10 || lastTwoDigits >= 20)
    )
        return SYMBOL_FORMS[1];
    return SYMBOL_FORMS[2];
};

const atLeast = (min: number) => `Щонайменше ${min} ${symbols(min)}`;

const atMost = (max: number) => `Не більше ${max} символів`;

export const USERNAME_HINT = `Латинські літери, цифри та _, від ${API_LIMITS.username.min} до ${API_LIMITS.username.max} символів`;

const USERNAME_ALLOWED = /^[A-Za-z0-9_]*$/;
const USERNAME_FIRST = /^[A-Za-z]/;

const SHOWN_INVALID_CHARACTERS = 3;

export const invalidUsernameCharacters = (value: string): string[] => [
    ...new Set([...value].filter((char) => !USERNAME_ALLOWED.test(char))),
];

const showCharacter = (char: string) =>
    /\s/.test(char) ? 'пробіл' : `«${char}»`;

/** `UsernameArgs.username` (signup only): letters, digits and `_`, starting with a letter. */
export const usernameSchema = z.string().superRefine((value, ctx) => {
    const issue = (message: string) =>
        ctx.addIssue({ code: z.ZodIssueCode.custom, message });

    if (value.length === 0) {
        return issue('Вкажіть нікнейм');
    }

    const invalid = [
        ...new Set(invalidUsernameCharacters(value).map(showCharacter)),
    ];

    if (invalid.length > 0) {
        const subject =
            invalid.length === 1
                ? 'Недопустимий символ'
                : 'Недопустимі символи';
        const shown = invalid.slice(0, SHOWN_INVALID_CHARACTERS).join(', ');
        const more = invalid.length > SHOWN_INVALID_CHARACTERS ? '…' : '';

        return issue(`${subject}: ${shown}${more}`);
    }

    if (!USERNAME_FIRST.test(value)) {
        return issue('Має починатися з літери');
    }

    if (value.length < API_LIMITS.username.min) {
        return issue(atLeast(API_LIMITS.username.min));
    }

    if (value.length > API_LIMITS.username.max) {
        return issue(atMost(API_LIMITS.username.max));
    }
});

const EMAIL_FORMAT = z.string().email();

/** `EmailArgs.email`: the API also refuses any address with a `+` (`check_email`). */
export const emailSchema = z.string().superRefine((value, ctx) => {
    const issue = (message: string) =>
        ctx.addIssue({ code: z.ZodIssueCode.custom, message });

    if (value.length === 0) {
        return issue('Вкажіть email');
    }

    if (!EMAIL_FORMAT.safeParse(value).success) {
        return issue('Некоректний email');
    }

    if (value.includes('+')) {
        return issue('Адреси з «+» не підтримуються');
    }
});

/** Login accepts a username or an email; both are at least `username.min` long. */
export const identifierSchema = z.string().superRefine((value, ctx) => {
    if (value.length === 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Вкажіть юзернейм або пошту',
        });
    } else if (value.length < API_LIMITS.username.min) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: atLeast(API_LIMITS.username.min),
        });
    }
});

export const passwordSchema = z
    .string()
    .min(API_LIMITS.password.min, atLeast(API_LIMITS.password.min))
    .max(API_LIMITS.password.max, atMost(API_LIMITS.password.max));

export const matchFields = <Field extends string>(
    field: Field,
    confirmation: Field,
    message: string,
): [
    (data: Record<Field, unknown>) => boolean,
    { message: string; path: [Field] },
] => [
    (data) => data[field] === data[confirmation],
    { message, path: [confirmation] },
];
