'use client';

import { Funnel } from 'lucide-react';
import { FC, Suspense, useState } from 'react';

import MaterialSymbolsEventListRounded from '@/components/icons/material-symbols/MaterialSymbolsEventListRounded';
import { MaterialSymbolsGridViewRounded } from '@/components/icons/material-symbols/MaterialSymbolsGridViewRounded';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { useCatalogView } from '@/features/anime/hooks/use-catalog-view';
import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';
import { useFiltersSidebar } from '@/features/filters/hooks/use-filters-sidebar';
import Sort from '@/features/filters/sort';
import { AnimeFiltersModal } from '@/features/watch';

import type { AnimeSearch } from '@/utils/search-schemas';

import Search from './components/search';

const ACTIVE_FILTER_KEYS = [
    'genres',
    'types',
    'statuses',
    'seasons',
    'ratings',
    'studios',
    'years',
    'date_range',
    'score',
    'only_translated',
] as const;

function countActiveFilters(search: Record<string, unknown>): number {
    let count = 0;
    for (const key of ACTIVE_FILTER_KEYS) {
        const value = search[key];
        if (value == null) continue;
        if (Array.isArray(value)) {
            if (value.length > 0) count += 1;
        } else if (typeof value === 'boolean') {
            if (value) count += 1;
        } else {
            count += 1;
        }
    }
    return count;
}

const AnimeListNavbar: FC = () => {
    const { visible: sidebarVisible, toggle: toggleSidebar } =
        useFiltersSidebar();
    const { view, setView } = useCatalogView();
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const search = useFilterSearch<AnimeSearch>();
    const activeCount = countActiveFilters(
        search as unknown as Record<string, unknown>,
    );

    return (
        <div className="flex flex-col gap-4">
            <div className="bg-secondary/20 flex flex-col gap-4 rounded-md border p-4 md:flex-row md:items-center">
                <div className="min-w-0 flex-1">
                    <Suspense>
                        <Search />
                    </Suspense>
                </div>
                <Separator
                    orientation="vertical"
                    className="hidden h-6 md:block"
                />

                <div className="flex items-center gap-4 overflow-hidden">
                    <div className="flex min-w-0 items-center gap-2">
                        <Sort sort_type="anime" compact className="min-w-0" />

                        <ToggleGroup
                            className="shrink-0"
                            variant="outline"
                            type="single"
                            value={view}
                            onValueChange={(value) => {
                                if (value) setView(value as Hikka.View);
                            }}
                        >
                            <ToggleGroupItem value="grid" aria-label="Сітка">
                                <MaterialSymbolsGridViewRounded />
                            </ToggleGroupItem>
                            <ToggleGroupItem value="list" aria-label="Список">
                                <MaterialSymbolsEventListRounded />
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                    <Separator orientation="vertical" className=" h-6" />
                    <div className="flex items-center gap-2">
                        {/* Mobile-only filters trigger */}
                        <Button
                            variant="outline"
                            size="icon-md"
                            onClick={() => setMobileFiltersOpen(true)}
                            className="relative shrink-0 lg:hidden"
                            aria-label="Фільтри"
                        >
                            <Funnel className="size-4" />
                            {activeCount > 0 && (
                                <Badge
                                    variant="default"
                                    className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 text-[10px]"
                                >
                                    {activeCount}
                                </Badge>
                            )}
                        </Button>

                        {/* Desktop-only sidebar toggle */}
                        <Button
                            variant={sidebarVisible ? 'default' : 'outline'}
                            size="md"
                            onClick={toggleSidebar}
                            className="hidden shrink-0 lg:inline-flex"
                            aria-label={
                                sidebarVisible
                                    ? 'Приховати фільтри'
                                    : 'Показати фільтри'
                            }
                        >
                            <Funnel className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <AnimeFiltersModal
                open={mobileFiltersOpen}
                onOpenChange={setMobileFiltersOpen}
                sort_type="anime"
            />
        </div>
    );
};

export default AnimeListNavbar;
