import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import {
    defaultParseSearch,
    defaultStringifySearch,
} from '@tanstack/react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ContentTypeEnum } from '@hikka/api';

import { presetToSearch } from '../preset-search-mapper';
import FilterPresetModal from './filter-preset-modal';
import type { FilterPreset } from './types';

const mocks = vi.hoisted(() => ({
    presets: [] as unknown[],
}));

vi.mock('@/utils/navigation', () => ({
    usePathname: () => '/anime',
    useRouteSearch: () => ({ search: 'naruto', page: 2 }),
}));

vi.mock('@/components/ui/text-link', () => ({
    default: ({
        to,
        search,
        children,
    }: {
        to?: string;
        search?: Record<string, unknown>;
        children?: ReactNode;
    }) => (
        <a href={to} data-search={JSON.stringify(search ?? null)}>
            {children}
        </a>
    ),
}));

vi.mock('./filter-presets-store', () => ({
    useFilterPresetsStore: () => ({
        filterPresets: mocks.presets,
        setFilterPresets: vi.fn(),
    }),
}));

const SINGLE_VALUES: FilterPreset = {
    id: 'single',
    name: 'Бойовики',
    content_types: [ContentTypeEnum.ANIME],
    genres: ['action'],
    statuses: ['ongoing'],
    years: [2020],
    score: [6, 9],
    only_translated: true,
    sort: 'score',
    order: 'desc',
};

const DATE_RANGE: FilterPreset = {
    id: 'date-range',
    name: 'Нещодавно завершені',
    content_types: [ContentTypeEnum.ANIME],
    statuses: ['finished'],
    date_range_enabled: true,
    date_range: [-1, 0],
};

const links = () => {
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(
        <FilterPresetModal contentType={ContentTypeEnum.ANIME} />,
    );

    return [...container.querySelectorAll('a')].map((link) => ({
        to: link.getAttribute('href'),
        search: JSON.parse(link.dataset.search ?? 'null') as Record<
            string,
            unknown
        > | null,
    }));
};

beforeEach(() => {
    mocks.presets = [SINGLE_VALUES, DATE_RANGE];
});

describe('FilterPresetModal preset links', () => {
    it('links to the current page with the preset as the search object', () => {
        expect(links()).toEqual([
            { to: '/anime', search: presetToSearch(SINGLE_VALUES) },
            { to: '/anime', search: presetToSearch(DATE_RANGE) },
        ]);
    });

    it('keeps a single-value list as a list', () => {
        const [{ search }] = links();

        expect(search?.genres).toEqual(['action']);
        expect(search?.statuses).toEqual(['ongoing']);
        expect(search?.years).toEqual([2020]);
    });

    it('survives the router search serialization as lists', () => {
        const [{ search }] = links();
        const url = defaultStringifySearch(search ?? {});

        expect(defaultParseSearch(url)).toEqual(presetToSearch(SINGLE_VALUES));
    });

    it('leaves the text query and the page out', () => {
        for (const { search } of links()) {
            expect(search).not.toHaveProperty('search');
            expect(search).not.toHaveProperty('page');
        }
    });
});
