import { z } from 'zod';

import { API_LIMITS, isWebUrl } from '@hikka/api';

import { getDeclensionWord, SYMBOL_FORMS } from './i18n';

// Each schema mirrors the backend validator for its field (hikka-io/hikka `app/schemas.py`).

export const atLeastSymbols = (min: number) =>
    `Щонайменше ${min} ${getDeclensionWord(min, SYMBOL_FORMS)}`;

export const atMostSymbols = (max: number) => `Не більше ${max} символів`;

export const USERNAME_HINT = `Латинські літери, цифри та _, від ${API_LIMITS.username.min} до ${API_LIMITS.username.max} символів`;

const USERNAME_ALLOWED = /^[A-Za-z0-9_]*$/;
const USERNAME_FIRST = /^[A-Za-z]/;

export const invalidUsernameCharacters = (value: string): string[] => [
    ...new Set([...value].filter((char) => !USERNAME_ALLOWED.test(char))),
];

const SHOWN_INVALID_CHARACTERS = 3;

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
        return issue(atLeastSymbols(API_LIMITS.username.min));
    }

    if (value.length > API_LIMITS.username.max) {
        return issue(atMostSymbols(API_LIMITS.username.max));
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

export const passwordSchema = z
    .string()
    .min(API_LIMITS.password.min, atLeastSymbols(API_LIMITS.password.min))
    .max(API_LIMITS.password.max, atMostSymbols(API_LIMITS.password.max));

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

export const userLinkTextSchema = z
    .string()
    .trim()
    .max(
        API_LIMITS.userLinkText.max,
        atMostSymbols(API_LIMITS.userLinkText.max),
    );

export const userLinkUrlSchema = z.string().superRefine((raw, ctx) => {
    const issue = (message: string) =>
        ctx.addIssue({ code: z.ZodIssueCode.custom, message });
    const value = raw.trim();

    if (value.length === 0) {
        return issue('Вкажіть посилання');
    }

    if (value.length > API_LIMITS.userLinkUrl.max) {
        return issue(atMostSymbols(API_LIMITS.userLinkUrl.max));
    }

    if (!isWebUrl(value)) {
        return issue('Посилання має починатися з https://');
    }
});
