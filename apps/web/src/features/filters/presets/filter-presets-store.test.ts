import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('gives a preset without an id a new one outside a secure context', async () => {
        vi.stubGlobal('crypto', undefined);
        writeKey('filter-presets', {
            filterPresets: [{ name: 'no id', content_types: ['anime'] }],
        });

        const state = await loadStore();

        expect(state.filterPresets).toEqual([
            { id: expect.any(String), name: 'no id', content_types: ['anime'] },
        ]);
        expect(state.filterPresets[0].id).not.toBe('');
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

    it('loads a preset saved before score was copied unchanged', async () => {
        const legacy = {
            id: 'legacy',
            name: 'Legacy',
            description: 'Old preset',
            content_types: ['anime', 'manga'],
            statuses: ['finished'],
            seasons: ['winter'],
            types: ['tv'],
            genres: ['action'],
            ratings: ['pg_13'],
            studios: ['studio'],
            years: [2000, 2010],
            only_translated: true,
            date_range_enabled: false,
            sort: 'score',
            order: 'desc',
        };
        writeKey('filter-presets', { filterPresets: [legacy] });

        const state = await loadStore();

        expect(state.filterPresets).toEqual([legacy]);
    });

    it('keeps a saved score range and unknown keys', async () => {
        writeKey('filter-presets', {
            filterPresets: [
                { ...preset('a'), score: [6, 9], future_key: { x: 1 } },
            ],
        });

        const state = await loadStore();

        expect(state.filterPresets[0]).toMatchObject({
            score: [6, 9],
            future_key: { x: 1 },
        });
    });

    it('survives malformed stored presets without dropping the others', async () => {
        writeKey('filter-presets', {
            filterPresets: [
                preset('a'),
                null,
                'junk',
                {
                    id: 'b',
                    name: 'b',
                    content_types: 'anime',
                    score: 'high',
                    genres: ['action'],
                },
                { name: 'no id' },
                preset('c'),
            ],
        });

        const state = await loadStore();

        expect(state._hasHydrated).toBe(true);
        expect(state.filterPresets.map((p) => p.name)).toEqual([
            'a',
            'b',
            'no id',
            'c',
        ]);
        expect(state.filterPresets[1]).toEqual({
            id: 'b',
            name: 'b',
            content_types: [],
            genres: ['action'],
        });
        expect(state.filterPresets[2].id).toEqual(expect.any(String));
        expect(state.filterPresets[2].content_types).toEqual([]);
        expect(
            readKey('filter-presets').state.filterPresets.map(
                (p: FilterPreset) => p.name,
            ),
        ).toEqual(['a', 'b', 'no id', 'c']);
    });

    it('falls back to the default when the stored list is not a list', async () => {
        writeKey('filter-presets', { filterPresets: 'junk' });

        const state = await loadStore();

        expect(state.filterPresets.map((p) => p.id)).toEqual([
            DEFAULT_PRESET_ID,
        ]);
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
