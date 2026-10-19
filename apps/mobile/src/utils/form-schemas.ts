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
    .min(API_LIMITS.password.min, atLeast(API_LIMITS.password.min))
    .max(API_LIMITS.password.max, atMost(API_LIMITS.password.max));
