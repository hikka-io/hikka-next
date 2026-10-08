import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { describe, expect, it } from 'vitest';

import { UiPreferencesProvider } from '@/services/ui-preferences-store';
import { cn } from '@/utils/cn';

import FiltersSidebarLayout from './filters-sidebar-layout';

const html = (node: ReactNode, collapsibles: Record<string, boolean> = {}) =>
    renderToStaticMarkup(
        <UiPreferencesProvider
            initial={{ views: {}, filters: {}, collapsibles }}
        >
            {node}
        </UiPreferencesProvider>,
    );

const LEGACY_PANEL =
    'sticky top-20 order-1 hidden max-h-[calc(100vh-9rem)] w-full overflow-hidden rounded-lg border border-border surface lg:order-2 lg:flex';

const LegacyCatalog = ({ visible }: { visible: boolean }) => (
    <div
        className={cn(
            'grid grid-cols-1 lg:items-start lg:gap-x-10',
            visible && 'lg:grid-cols-[1fr_30%] xl:grid-cols-[1fr_25%]',
        )}
    >
        <div className="flex flex-col gap-4">
            <i>navbar</i>
            <i>list</i>
        </div>

        {visible && (
            <div className={LEGACY_PANEL}>
                <b>filters</b>
            </div>
        )}
    </div>
);

const LegacyEdit = () => (
    <div className="grid grid-cols-1 justify-center gap-x-10 gap-y-8 lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-col gap-12">
            <i>list</i>
        </div>
        <div className={LEGACY_PANEL}>
            <b>filters</b>
        </div>
    </div>
);

describe('FiltersSidebarLayout', () => {
    it.each([
        ['visible', {}, true],
        ['hidden', { catalog_filters_sidebar: false }, false],
    ])(
        'matches the catalog markup with the sidebar %s',
        (_, prefs, visible) => {
            expect(
                html(
                    <FiltersSidebarLayout sidebar={<b>filters</b>}>
                        <i>navbar</i>
                        <i>list</i>
                    </FiltersSidebarLayout>,
                    prefs,
                ),
            ).toBe(html(<LegacyCatalog visible={visible} />));
        },
    );

    it('reads visibility from its storage key', () => {
        const layout = (
            <FiltersSidebarLayout
                storageKey="userlist_filters_sidebar"
                sidebar={<b>filters</b>}
            >
                <i>navbar</i>
                <i>list</i>
            </FiltersSidebarLayout>
        );

        expect(html(layout, { catalog_filters_sidebar: false })).toBe(
            html(<LegacyCatalog visible />),
        );
        expect(html(layout, { userlist_filters_sidebar: false })).toBe(
            html(<LegacyCatalog visible={false} />),
        );
    });

    it('keeps a non-collapsible sidebar and its own grid classes', () => {
        expect(
            html(
                <FiltersSidebarLayout
                    collapsible={false}
                    className="grid grid-cols-1 justify-center gap-x-10 gap-y-8 lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between"
                    contentClassName="flex min-w-0 flex-col gap-12"
                    sidebar={<b>filters</b>}
                >
                    <i>list</i>
                </FiltersSidebarLayout>,
                { catalog_filters_sidebar: false },
            ),
        ).toBe(html(<LegacyEdit />));
    });
});
