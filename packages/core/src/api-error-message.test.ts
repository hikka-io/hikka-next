import { describe, expect, it } from 'vitest';

import { HikkaApiError } from '@hikka/api';

import { apiErrorMessage } from './api-error-message';

describe('apiErrorMessage', () => {
    it('returns the message of an API error', () => {
        expect(
            apiErrorMessage(
                new HikkaApiError('Занадто багато спроб', 429, 'rate_limit'),
                'fallback',
            ),
        ).toBe('Занадто багато спроб');
    });

    it('returns the message of a plain error', () => {
        expect(apiErrorMessage(new Error('Failed to fetch'), 'fallback')).toBe(
            'Failed to fetch',
        );
    });

    it('falls back for an empty message', () => {
        expect(apiErrorMessage(new Error(''), 'fallback')).toBe('fallback');
    });

    it.each([
        ['a thrown string', 'boom'],
        ['a response body', { detail: 'nope' }],
        ['null', null],
        ['undefined', undefined],
    ])('falls back for %s', (_label, error) => {
        expect(apiErrorMessage(error, 'fallback')).toBe('fallback');
    });
});
