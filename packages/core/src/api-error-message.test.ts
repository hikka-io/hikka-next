import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { HikkaApiError } from '@hikka/api';

import {
    apiErrorMessage,
    isNetworkError,
    NETWORK_ERROR_MESSAGE,
} from './api-error-message';

describe('apiErrorMessage', () => {
    it('returns the message of an API error', () => {
        expect(
            apiErrorMessage(
                new HikkaApiError('Занадто багато спроб', 429, 'rate_limit'),
                'fallback',
            ),
        ).toBe('Занадто багато спроб');
    });

    it('maps a dropped connection to the network copy', () => {
        const dropped = new HikkaApiError(
            'fetch failed: UnexpectedException',
            0,
            'unknown_error',
        );

        expect(isNetworkError(dropped)).toBe(true);
        expect(apiErrorMessage(dropped, 'fallback')).toBe(
            NETWORK_ERROR_MESSAGE,
        );
    });

    it('maps a thrown fetch failure to the network copy', () => {
        expect(
            apiErrorMessage(
                new TypeError('Network request failed'),
                'fallback',
            ),
        ).toBe(NETWORK_ERROR_MESSAGE);
        expect(
            apiErrorMessage(new TypeError('Failed to fetch'), 'fallback'),
        ).toBe(NETWORK_ERROR_MESSAGE);
    });

    it('keeps the backend message for a real API error', () => {
        const error = new HikkaApiError('Невірний пароль', 401, 'auth:invalid');

        expect(isNetworkError(error)).toBe(false);
        expect(apiErrorMessage(error, 'fallback')).toBe('Невірний пароль');
    });

    it('maps each runtime wording of a failed fetch', () => {
        for (const message of [
            'Network request failed',
            'The network connection was lost.',
            'Load failed',
            'Failed to fetch',
            'NetworkError when attempting to fetch resource.',
            'fetch failed: UnexpectedException',
        ]) {
            expect(apiErrorMessage(new TypeError(message), 'fallback')).toBe(
                NETWORK_ERROR_MESSAGE,
            );
        }
    });

    it('does not read an aborted request or another failure as offline', () => {
        const aborted = new DOMException(
            'The operation was aborted.',
            'AbortError',
        );

        expect(isNetworkError(aborted)).toBe(false);
        expect(
            isNetworkError(new HikkaApiError(aborted.message, 0, 'x', aborted)),
        ).toBe(false);
        expect(
            apiErrorMessage(
                new HikkaApiError('Invalid URL', 0, 'unknown_error'),
                'fallback',
            ),
        ).toBe('Invalid URL');
        expect(
            apiErrorMessage(
                new TypeError("Cannot read property 'x'"),
                'fallback',
            ),
        ).toBe("Cannot read property 'x'");
    });

    it('falls back for a validation dump wrapped as an API error', () => {
        const { error } = z.object({ id: z.string() }).safeParse({ id: 1 });
        const wrapped = new HikkaApiError(
            error?.message ?? '',
            200,
            'unknown_error',
            error,
        );
        const unwrapped = new HikkaApiError(
            error?.message ?? '',
            200,
            'unknown_error',
        );

        expect(apiErrorMessage(wrapped, 'fallback')).toBe('fallback');
        expect(apiErrorMessage(unwrapped, 'fallback')).toBe('fallback');
    });

    it('returns the message of a plain error', () => {
        expect(apiErrorMessage(new Error('Boom'), 'fallback')).toBe('Boom');
    });

    it('falls back for a response that failed validation', () => {
        const { error } = z.object({ id: z.string() }).safeParse({ id: 1 });

        expect(error?.message).toContain('invalid_type');
        expect(apiErrorMessage(error, 'fallback')).toBe('fallback');
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
