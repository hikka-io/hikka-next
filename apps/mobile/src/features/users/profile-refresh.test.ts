import type { Query } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';

import { byProfile } from './profile-refresh';

const query = (key: Record<string, unknown>) =>
    ({ queryKey: [key] }) as unknown as Query;

describe('byProfile', () => {
    const matches = byProfile(['Olexh', 'olexh']);

    it('matches queries keyed by path.username in any case', () => {
        expect(matches(query({ path: { username: 'OLEXH' } }))).toBe(true);
    });

    it('matches the collections and articles keyed by body.author', () => {
        expect(matches(query({ body: { author: 'olexh' } }))).toBe(true);
    });

    it('leaves other users and unrelated queries alone', () => {
        expect(matches(query({ path: { username: 'other' } }))).toBe(false);
        expect(matches(query({ body: { author: 'other' } }))).toBe(false);
        expect(matches(query({ body: {} }))).toBe(false);
        expect(matches({ queryKey: ['plain'] } as unknown as Query)).toBe(
            false,
        );
    });
});
