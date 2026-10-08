import { afterEach, describe, expect, it, vi } from 'vitest';

import { newId } from './new-id';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

describe('newId', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('uses crypto.randomUUID where it exists', () => {
        expect(newId()).toMatch(UUID);
    });

    it.each([
        ['without crypto', undefined],
        ['outside a secure context', {}],
    ])('falls back to a random id %s', (_, crypto) => {
        vi.stubGlobal('crypto', crypto);

        const ids = new Set([newId(), newId(), newId()]);

        expect(ids.size).toBe(3);
        for (const id of ids) expect(id).toMatch(/^[0-9a-z]+-[0-9a-z]+$/);
    });
});
