import { z } from '@/utils/i18n/zod';

/**
 * Field rules shared by the account and client forms.
 *
 * Each schema mirrors the backend validator for the same field
 * (hikka-io/hikka: `app/schemas.py`, `app/client/schemas.py`), so a form
 * rejects exactly what the API would answer with a 400
 * "Invalid field … in request body" — before the request is sent, with a
 * message that says what to fix.
 */

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

const USERNAME_ALLOWED = /^[A-Za-z0-9_]*$/;
const USERNAME_FIRST = /^[A-Za-z]/;

/** Distinct characters the username may not contain, in input order. */
export const invalidUsernameCharacters = (value: string): string[] => [
    ...new Set([...value].filter((char) => !USERNAME_ALLOWED.test(char))),
];

/**
 * One message at a time, most actionable first: a wrong character is the
 * thing the user has to go back and fix, the length they see as they type.
 */
export const usernameSchema = z.string().superRefine((value, ctx) => {
    const issue = (message: string) =>
        ctx.addIssue({ code: z.ZodIssueCode.custom, message });

    if (value.length === 0) {
        return issue("Вкажіть ім'я користувача");
    }

    const invalid = invalidUsernameCharacters(value);

    if (invalid.length > 0) {
        const shown = invalid.map((char) => `«${char}»`).join(', ');

        return issue(
            `Недопустимі символи: ${shown}. Можна лише латинські літери, цифри та _`,
        );
    }

    if (!USERNAME_FIRST.test(value)) {
        return issue("Ім'я має починатися з латинської літери");
    }

    if (value.length < USERNAME_MIN_LENGTH) {
        return issue(`Щонайменше ${USERNAME_MIN_LENGTH} символів`);
    }

    if (value.length > USERNAME_MAX_LENGTH) {
        return issue(`Не більше ${USERNAME_MAX_LENGTH} символів`);
    }
});

/**
 * `EmailArgs.email`: a valid address; the API also refuses a `+` in it.
 * One message at a time, like the username: an empty field is only "enter an
 * email", not also "check the address" — zod's `.min(1).email()` reported
 * both at once.
 */
const EMAIL_FORMAT = z.string().email();

export const emailSchema = z.string().superRefine((value, ctx) => {
    const issue = (message: string) =>
        ctx.addIssue({ code: z.ZodIssueCode.custom, message });

    if (value.length === 0) {
        return issue('Вкажіть email');
    }

    if (!EMAIL_FORMAT.safeParse(value).success) {
        return issue(
            'Перевірте адресу: вона має бути на кшталт name@example.com',
        );
    }

    if (value.includes('+')) {
        return issue('Hikka не приймає адреси із символом «+»');
    }
});

export const passwordSchema = z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Щонайменше ${PASSWORD_MIN_LENGTH} символів`)
    .max(PASSWORD_MAX_LENGTH, `Не більше ${PASSWORD_MAX_LENGTH} символів`);

/**
 * The API strips surrounding whitespace and a couple of invisible characters
 * (Braille blank U+2800, U+FFF4) from client names and descriptions before it
 * checks the length, so "  a " counts as one character.
 */
const BAD_CHARACTERS = /[\u2800\ufff4]/g; // `utils.remove_bad_characters` in the backend

const trimmedText = (min: number, max: number) =>
    z.string().superRefine((value, ctx) => {
        const length = value.replace(BAD_CHARACTERS, '').trim().length;
        if (length < min) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Щонайменше ${min} символи`,
            });
        } else if (length > max) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Не більше ${max} символів`,
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

/**
 * `ClientCreate.endpoint`: pydantic `AnyUrl`, i.e. an absolute URL with any
 * scheme (`https://…`, `http://localhost/…`, `myapp://auth`), at most 128
 * characters long *after* normalisation — the API measures `str(AnyUrl)`,
 * which, like the WHATWG `URL.href`, adds the trailing slash to a bare
 * origin.
 */
export const parseEndpoint = (value: string): URL | null => {
    try {
        return new URL(value);
    } catch {
        return null;
    }
};

/** Four dot-separated numbers, each 0–255 — anything else is not an IPv4 address. */
const ipv4 = (host: string): number[] | null => {
    const parts = host.split('.');
    if (parts.length !== 4 || !parts.every((p) => /^\d{1,3}$/.test(p)))
        return null;
    const nums = parts.map(Number);
    return nums.every((n) => n <= 255) ? nums : null;
};

/**
 * Hosts a redirect usually points to during development, served over plain
 * HTTP: localhost, `*.localhost`, and loopback, private and link-local
 * addresses (IPv4 by numeric range; IPv6 `::1`, `fc00::/7`, `fe80::/10`).
 */
const isLocalHost = (host: string): boolean => {
    const h = host.toLowerCase();
    if (h === 'localhost' || h.endsWith('.localhost')) return true;
    if (h.startsWith('[') && h.endsWith(']')) {
        const v6 = h.slice(1, -1);
        return (
            v6 === '::1' ||
            /^f[cd][0-9a-f]{0,2}:/.test(v6) ||
            /^fe[89ab][0-9a-f]?:/.test(v6)
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

/** A real domain: dot-separated labels ending in a letters-only TLD (IDN included). */
const DOMAIN = /^(?:[\p{L}\p{N}](?:[\p{L}\p{N}-]*[\p{L}\p{N}])?\.)+\p{L}{2,}$/u;

/**
 * The address the user most likely meant when they typed a host without a
 * scheme — `http://` for localhost and private addresses (a dev server rarely
 * has TLS), `https://` for a real domain — or `null` when the value does not
 * start with a bare host (a path, or a custom scheme such as `myapp:auth`).
 *
 * Both kinds need catching: `example.com/callback` is not a URL at all, while
 * `localhost:3000/callback` is a *valid* one with the scheme "localhost", so
 * the API would store it and every login would bounce to nowhere.
 */
export const suggestEndpoint = (value: string): string | null => {
    if (value.includes('://')) return null;

    // A bracketed IPv6 literal, or a host without `:`, `/`, `?`, `#`; then an
    // optional port.
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

    // Only suggest what is itself a valid address: `192.168.999.999` looks
    // like a private IP but is not one, and no scheme would make it valid.
    return suggestion && parseEndpoint(suggestion) ? suggestion : null;
};

export const endpointSchema = z.string().superRefine((raw, ctx) => {
    const issue = (message: string) =>
        ctx.addIssue({ code: z.ZodIssueCode.custom, message });
    const value = raw.trim();

    if (value.length === 0) {
        return issue('Вкажіть адресу, куди повертати користувача');
    }

    const suggestion = suggestEndpoint(value);

    if (suggestion) {
        return issue(`Схоже, бракує схеми — мабуть, ${suggestion}`);
    }

    const url = /\s/.test(raw) ? null : parseEndpoint(value);

    if (!url) {
        return issue(
            'Потрібна повна адреса зі схемою: https://example.com/callback або myapp://auth',
        );
    }

    if (url.href.length > CLIENT_ENDPOINT_MAX_LENGTH) {
        return issue(
            `Адреса задовга: ${url.href.length} із ${CLIENT_ENDPOINT_MAX_LENGTH} символів`,
        );
    }
});
