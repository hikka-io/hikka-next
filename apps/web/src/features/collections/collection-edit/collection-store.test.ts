import { afterEach, describe, expect, it, vi } from 'vitest';

import { createCollectionStore } from './collection-store';

describe('createCollectionStore ids', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it.each([
        ['without crypto', undefined],
        ['outside a secure context', {}],
    ])('creates and adds groups %s', (_, crypto) => {
        vi.stubGlobal('crypto', crypto);

        const store = createCollectionStore();
        store.getState().addGroup();
        store.getState().addGroup();

        const ids = store.getState().groups.map((group) => group.id);
        expect(ids).toHaveLength(2);
        expect(new Set(ids).size).toBe(2);
        for (const id of ids) expect(id).toEqual(expect.any(String));
    });
});
