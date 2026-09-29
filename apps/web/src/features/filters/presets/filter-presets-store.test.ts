import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { FilterPreset } from './types';

const DEFAULT_PRESET_ID = 'ffc33695-017c-4404-9c5d-7b76864a6cfb';

const preset = (id: string, sort?: string | string[]) =>
    ({ id, name: id, content_types: ['anime'], sort }) as FilterPreset;

const writeKey = (key: string, state: object) =>
    localStorage.setItem(key, JSON.stringify({ state, version: 0 }));

const readKey = (key: string) =>
    JSON.parse(localStorage.getItem(key) ?? 'null');

async function loadStore() {
    vi.resetModules();
    const { useFilterPresetsStore } = await import('./filter-presets-store');
    return useFilterPresetsStore.getState();
}

describe('useFilterPresetsStore', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('gives a fresh user the default preset and persists it', async () => {
        const state = await loadStore();

        expect(state._hasHydrated).toBe(true);
        expect(state.filterPresets.map((p) => p.id)).toEqual([
            DEFAULT_PRESET_ID,
        ]);
        expect(readKey('filter-presets')).toEqual({
            state: {
                _hasHydrated: true,
                filterPresets: state.filterPresets,
            },
            version: 0,
        });
        expect(localStorage.getItem('settings')).toBeNull();
    });

    it('migrates presets from the legacy settings key', async () => {
        writeKey('settings', {
            editTags: ['tag'],
            filterPresets: [preset('a', 'score'), preset('b')],
            _hasHydrated: true,
        });

        const state = await loadStore();

        expect(state.filterPresets.map((p) => p.id)).toEqual(['a', 'b']);
        expect(readKey('filter-presets').state).toEqual({
            _hasHydrated: true,
            filterPresets: [
                { id: 'a', name: 'a', content_types: ['anime'], sort: 'score' },
                { id: 'b', name: 'b', content_types: ['anime'] },
            ],
        });
    });

    it('keeps an empty legacy preset list empty', async () => {
        writeKey('settings', { editTags: [], filterPresets: [] });

        const state = await loadStore();

        expect(state.filterPresets).toEqual([]);
        expect(readKey('filter-presets').state.filterPresets).toEqual([]);
    });

    it('keeps an empty own preset list empty', async () => {
        writeKey('filter-presets', { filterPresets: [], _hasHydrated: true });
        writeKey('settings', { filterPresets: [preset('legacy')] });

        const state = await loadStore();

        expect(state.filterPresets).toEqual([]);
    });

    it('prefers its own key over the legacy settings key', async () => {
        writeKey('filter-presets', {
            filterPresets: [preset('own')],
            _hasHydrated: true,
        });
        writeKey('settings', { filterPresets: [preset('legacy')] });

        const state = await loadStore();

        expect(state.filterPresets.map((p) => p.id)).toEqual(['own']);
    });

    it('falls back to the default when the legacy key has no presets', async () => {
        writeKey('settings', { editTags: ['tag'] });

        const state = await loadStore();

        expect(state.filterPresets.map((p) => p.id)).toEqual([
            DEFAULT_PRESET_ID,
        ]);
    });

    it('migrates an array sort from the legacy key', async () => {
        writeKey('settings', {
            filterPresets: [preset('a', ['start_date:desc', 'score:desc'])],
        });

        const state = await loadStore();

        expect(state.filterPresets[0].sort).toBe('start_date:desc');
        expect(readKey('filter-presets').state.filterPresets[0].sort).toBe(
            'start_date:desc',
        );
    });

    it('migrates an array sort from its own key', async () => {
        writeKey('filter-presets', {
            filterPresets: [preset('a', ['score:desc']), preset('b', [])],
        });

        const state = await loadStore();

        expect(state.filterPresets[0].sort).toBe('score:desc');
        expect(state.filterPresets[1].sort).toBeUndefined();
    });

    it('falls back to the default on corrupt legacy JSON', async () => {
        localStorage.setItem('settings', '{not json');

        const state = await loadStore();

        expect(state._hasHydrated).toBe(true);
        expect(state.filterPresets.map((p) => p.id)).toEqual([
            DEFAULT_PRESET_ID,
        ]);
    });

    it('never touches the legacy settings key', async () => {
        const legacy = JSON.stringify({
            state: { editTags: ['tag'], filterPresets: [preset('a')] },
            version: 0,
        });
        localStorage.setItem('settings', legacy);

        const store = await loadStore();
        store.setFilterPresets([]);

        expect(localStorage.getItem('settings')).toBe(legacy);
        expect(readKey('filter-presets').state.filterPresets).toEqual([]);
    });
});
