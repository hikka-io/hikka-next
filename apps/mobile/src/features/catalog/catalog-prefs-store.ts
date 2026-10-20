import { create } from 'zustand';

import { ContentTypeEnum } from '@hikka/api';

import type { CatalogType } from '@/features/filters';

export type CatalogView = 'grid' | 'list';

type CatalogPrefsState = {
    type: CatalogType;
    view: CatalogView;
    setType: (type: CatalogType) => void;
    setView: (view: CatalogView) => void;
};

/** In memory until the app has a persistent prefs store (MMKV needs a dev client). */
export const useCatalogPrefs = create<CatalogPrefsState>()((set) => ({
    type: ContentTypeEnum.ANIME,
    view: 'grid',
    setType: (type) => set({ type }),
    setView: (view) => set({ view }),
}));
