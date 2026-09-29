import { beforeEach, describe, expect, it, vi } from 'vitest';

const DEFAULT_EDIT_TAGS = [
    'Додано назву',
    'Додано синоніми',
    'Додано опис',
    'Додано імʼя',
];

const writeKey = (key: string, state: object) =>
    localStorage.setItem(key, JSON.stringify({ state, version: 0 }));

const readKey = (key: string) =>
    JSON.parse(localStorage.getItem(key) ?? 'null');

async function loadStore() {
    vi.resetModules();
    const { useEditTagsStore } = await import('./edit-tags-store');
    return useEditTagsStore.getState();
}

describe('useEditTagsStore', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('gives a fresh user the default tags and persists them', async () => {
        const state = await loadStore();

        expect(state._hasHydrated).toBe(true);
        expect(state.editTags).toEqual(DEFAULT_EDIT_TAGS);
        expect(readKey('edit-tags')).toEqual({
            state: { _hasHydrated: true, editTags: DEFAULT_EDIT_TAGS },
            version: 0,
        });
        expect(localStorage.getItem('settings')).toBeNull();
    });

    it('migrates tags from the legacy settings key', async () => {
        writeKey('settings', {
            editTags: ['custom'],
            filterPresets: [{ id: 'a', name: 'a', content_types: ['anime'] }],
            _hasHydrated: true,
        });

        const state = await loadStore();

        expect(state.editTags).toEqual(['custom']);
        expect(readKey('edit-tags').state).toEqual({
            _hasHydrated: true,
            editTags: ['custom'],
        });
    });

    it('keeps an empty legacy tag list empty', async () => {
        writeKey('settings', { editTags: [], filterPresets: [] });

        const state = await loadStore();

        expect(state.editTags).toEqual([]);
        expect(readKey('edit-tags').state.editTags).toEqual([]);
    });

    it('prefers its own key over the legacy settings key', async () => {
        writeKey('edit-tags', { editTags: ['own'], _hasHydrated: true });
        writeKey('settings', { editTags: ['legacy'] });

        const state = await loadStore();

        expect(state.editTags).toEqual(['own']);
    });

    it('falls back to the default when the legacy key has no tags', async () => {
        writeKey('settings', { filterPresets: [] });

        const state = await loadStore();

        expect(state.editTags).toEqual(DEFAULT_EDIT_TAGS);
    });

    it('falls back to the default on corrupt legacy JSON', async () => {
        localStorage.setItem('settings', '{not json');

        const state = await loadStore();

        expect(state._hasHydrated).toBe(true);
        expect(state.editTags).toEqual(DEFAULT_EDIT_TAGS);
    });

    it('never touches the legacy settings key', async () => {
        const legacy = JSON.stringify({
            state: { editTags: ['custom'], filterPresets: [] },
            version: 0,
        });
        localStorage.setItem('settings', legacy);

        const store = await loadStore();
        store.setEditTags(['custom', 'new']);

        expect(localStorage.getItem('settings')).toBe(legacy);
        expect(readKey('edit-tags').state.editTags).toEqual(['custom', 'new']);
    });
});
