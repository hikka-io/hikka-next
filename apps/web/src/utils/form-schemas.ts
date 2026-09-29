import { getDeclensionWord } from '@/utils/i18n/declension';
import { SYMBOL_FORMS } from '@/utils/i18n/word-forms';
import { z } from '@/utils/i18n/zod';

// Each schema mirrors the backend validator for its field (hikka-io/hikka `app/schemas.py`, `app/client/schemas.py`).

/** `UsernameArgs.username`: `^[A-Za-z][A-Za-z0-9_]{4,63}$`. */
export const USERNAME_MIN_LENGTH = 5;
export const USERNAME_MAX_LENGTH = 64;

/** `PasswordArgs.password`: `min_length=8, max_length=256`. */
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 256;

/** `ClientCreate` / `ClientUpdate` limits (`app/constants.py`). */
export const CLIENT_NAME_MIN_LENGTH = 3;
export const CLIENT_NAME_MAX_LENGTH = 128;
export const CLIENT_DESCRIPTION_MIN_LENGTH = 3;
export const CLIENT_DESCRIPTION_MAX_LENGTH = 512;
export const CLIENT_ENDPOINT_MAX_LENGTH = 128;

export const USERNAME_HINT = `Латинські літери, цифри та _, від ${USERNAME_MIN_LENGTH} до ${USERNAME_MAX_LENGTH} символів`;

export const ENDPOINT_HINT = 'Куди Hikka поверне користувача після входу';

const USERNAME_ALLOWED = /^[A-Za-z0-9_]*$/;
const USERNAME_FIRST = /^[A-Za-z]/;

const atLeast = (min: number) =>
    `Щонайменше ${min} ${getDeclensionWord(min, SYMBOL_FORMS)}`;

const atMost = (max: number) => `Не більше ${max} символів`;

export const invalidUsernameCharacters = (value: string): string[] => [
    ...new Set([...value].filter((char) => !USERNAME_ALLOWED.test(char))),
];

const SHOWN_INVALID_CHARACTERS = 3;

const showCharacter = (char: string) =>
    /\s/.test(char) ? 'пробіл' : `«${char}»`;

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

    if (value.length < USERNAME_MIN_LENGTH) {
        return issue(atLeast(USERNAME_MIN_LENGTH));
    }

    if (value.length > USERNAME_MAX_LENGTH) {
        return issue(atMost(USERNAME_MAX_LENGTH));
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
    .min(PASSWORD_MIN_LENGTH, atLeast(PASSWORD_MIN_LENGTH))
    .max(PASSWORD_MAX_LENGTH, atMost(PASSWORD_MAX_LENGTH));

// The API runs `utils.remove_bad_characters` and `.strip()` before checking the length.
const BAD_CHARACTERS = /[\u2800\ufff4]/g;

const trimmedText = (min: number, max: number) =>
    z.string().superRefine((value, ctx) => {
        const length = value.replace(BAD_CHARACTERS, '').trim().length;
        if (length < min) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: atLeast(min),
            });
        } else if (length > max) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: atMost(max),
            });
        }
    });

export const clientNameSchema = trimmedText(
    CLIENT_NAME_MIN_LENGTH,
    CLIENT_NAME_MAX_LENGTH,
);

export const clientDescriptionSchema = trimmedText(
    CLIENT_DESCRIPTION_MIN_LENGTH,
    CLIENT_DESCRIPTION_MAX_LENGTH,
);

export const parseEndpoint = (value: string): URL | null => {
    try {
        return new URL(value);
    } catch {
        return null;
    }
};

const ipv4 = (host: string): number[] | null => {
    const parts = host.split('.');
    if (parts.length !== 4 || !parts.every((p) => /^\d{1,3}$/.test(p)))
        return null;
    const nums = parts.map(Number);
    return nums.every((n) => n <= 255) ? nums : null;
};

const isLocalHost = (host: string): boolean => {
    const h = host.toLowerCase();
    if (h === 'localhost' || h.endsWith('.localhost')) return true;
    if (h.startsWith('[') && h.endsWith(']')) {
        const v6 = h.slice(1, -1);
        return (
            v6 === '::1' ||
            /^f[cd][0-9a-f]{2}:/.test(v6) ||
            /^fe[89ab][0-9a-f]:/.test(v6)
        );
    }
    const n = ipv4(h);
    if (!n) return false;
    return (
        n[0] === 127 ||
        n[0] === 10 ||
        (n[0] === 192 && n[1] === 168) ||
        (n[0] === 172 && n[1] >= 16 && n[1] <= 31) ||
        (n[0] === 169 && n[1] === 254) ||
        n.every((x) => x === 0)
    );
};

/** Dot-separated labels ending in a letters-only TLD (IDN included). */
const DOMAIN = /^(?:[\p{L}\p{N}](?:[\p{L}\p{N}-]*[\p{L}\p{N}])?\.)+\p{L}{2,}$/u;

// `localhost:3000/cb` parses as a valid URL with the scheme "localhost", so a missing scheme is caught before parsing.
export const suggestEndpoint = (value: string): string | null => {
    if (value.includes('://')) return null;

    // A bracketed IPv6 literal or a bare host, then an optional port.
    const host = /^(\[[0-9a-f:.]+\]|[^/?#:\s[\]]+)(?::\d+)?(?=$|[/?#])/i.exec(
        value,
    )?.[1];

    if (!host) return null;

    const scheme = isLocalHost(host)
        ? 'http://'
        : DOMAIN.test(host)
          ? 'https://'
          : null;
    const suggestion = scheme && `${scheme}${value}`;

    return suggestion && parseEndpoint(suggestion) ? suggestion : null;
};

// The API measures `str(AnyUrl)`, which normalises like `URL.href` (a bare origin gains a trailing slash).
export const endpointSchema = z.string().superRefine((raw, ctx) => {
    const issue = (message: string) =>
        ctx.addIssue({ code: z.ZodIssueCode.custom, message });
    const value = raw.trim();

    if (value.length === 0) {
        return issue('Вкажіть посилання');
    }

    const suggestion = suggestEndpoint(value);

    if (suggestion) {
        return issue(`Додайте схему: ${suggestion}`);
    }

    const url = parseEndpoint(raw);

    if (!url) {
        return issue('Потрібне повне посилання: https://… або myapp://…');
    }

    if (url.href.length > CLIENT_ENDPOINT_MAX_LENGTH) {
        return issue(
            `${atMost(CLIENT_ENDPOINT_MAX_LENGTH)} (зараз ${url.href.length})`,
        );
    }
});
