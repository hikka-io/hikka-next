'use client';

import { ContentTypeEnum } from '@hikka/client';
import { Funnel, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { FC, Suspense, useState } from 'react';

import MaterialSymbolsEventListRounded from '@/components/icons/material-symbols/MaterialSymbolsEventListRounded';
import { MaterialSymbolsGridViewRounded } from '@/components/icons/material-symbols/MaterialSymbolsGridViewRounded';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
    Tooltip,
    TooltipContent,
    TooltipPortal,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { useCatalogView } from '@/features/anime/hooks/use-catalog-view';
import {
    FilterPresetButton,
    FilterPresets,
    useActiveFilters,
} from '@/features/content';
import { useFiltersSidebar } from '@/features/filters/hooks/use-filters-sidebar';
import Sort from '@/features/filters/sort';
import { AnimeFiltersModal } from '@/features/watch';

import Search from './components/search';

const AnimeListNavbar: FC = () => {
    const { visible: sidebarVisible, toggle: toggleSidebar } =
        useFiltersSidebar();
    const { view, setView } = useCatalogView();
    const { count: activeCount } = useActiveFilters();
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    return (
        <>
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

                <div className="flex items-center gap-2">
                    <Sort
                        sort_type="anime"
                        compact
                        className="min-w-0 overflow-hidden"
                        placeholder="Сортування"
                    />

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

                    <Separator orientation="vertical" className="h-6" />

                    {/* Mobile: open filters in a sheet */}
                    <Button
                        variant="outline"
                        size="icon-md"
                        onClick={() => setMobileFiltersOpen(true)}
                        className="relative shrink-0 overflow-visible lg:hidden"
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

                    {/* Desktop: toggle sticky sidebar panel */}
                    <Tooltip>
                        <TooltipTrigger asChild>
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
                                {sidebarVisible ? (
                                    <PanelRightClose className="size-4" />
                                ) : (
                                    <PanelRightOpen className="size-4" />
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipPortal>
                            <TooltipContent>
                                <p className="text-sm">
                                    {sidebarVisible
                                        ? 'Приховати панель фільтрів'
                                        : 'Показати панель фільтрів'}
                                </p>
                            </TooltipContent>
                        </TooltipPortal>
                    </Tooltip>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <FilterPresets content_type={ContentTypeEnum.ANIME} />
                <Separator className="h-6" orientation="vertical" />
                <FilterPresetButton />
            </div>

            <AnimeFiltersModal
                open={mobileFiltersOpen}
                onOpenChange={setMobileFiltersOpen}
                sort_type="anime"
            />
        </>
    );
};

export default AnimeListNavbar;
