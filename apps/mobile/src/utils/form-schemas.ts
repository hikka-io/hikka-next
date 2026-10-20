import { z } from 'zod';

import { API_LIMITS } from '@hikka/api';
import { atLeastSymbols } from '@hikka/core';

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
            message: atLeastSymbols(API_LIMITS.username.min),
        });
    }
});
