import { describe, expect, it } from 'vitest';

import { firstFieldError } from './first-field-error';

const state = (
    submissionAttempts: number,
    meta: Record<string, { isBlurred: boolean; message?: string }>,
) => ({
    submissionAttempts,
    fieldMeta: Object.fromEntries(
        Object.entries(meta).map(([name, { isBlurred, message }]) => [
            name,
            { isBlurred, errors: message ? [{ message }] : [] },
        ]),
    ),
});

describe('firstFieldError', () => {
    it('stays quiet while the user is still typing', () => {
        expect(
            firstFieldError(
                state(0, { email: { isBlurred: false, message: 'bad' } }),
                ['email'],
            ),
        ).toBeUndefined();
    });

    it('shows the error of a field the user left', () => {
        expect(
            firstFieldError(
                state(0, { email: { isBlurred: true, message: 'bad' } }),
                ['email'],
            ),
        ).toBe('bad');
    });

    it('shows every error after a submit attempt, in field order', () => {
        expect(
            firstFieldError(
                state(1, {
                    email: { isBlurred: false },
                    confirmation: { isBlurred: false, message: 'differs' },
                }),
                ['email', 'confirmation'],
            ),
        ).toBe('differs');
    });
});
