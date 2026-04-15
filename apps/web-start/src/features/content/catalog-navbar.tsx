'use client';

import { ContentTypeEnum } from '@hikka/client';
import { useRouter } from '@tanstack/react-router';
import { Filter, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { FC, Suspense, useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import {
    FilterPresetButton,
    FilterPresets,
    useActiveFilters,
} from '@/features/content';
import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';
import { useFiltersSidebar } from '@/features/filters/hooks/use-filters-sidebar';
import type { SortType } from '@/features/filters/sort';
import Sort from '@/features/filters/sort';

import useDebounce from '@/services/hooks/use-debounce';

interface Props {
    sort_type: SortType;
    content_type: ContentTypeEnum;
    searchPlaceholder: string;
    renderFilterModal: (props: {
        open: boolean;
        onOpenChange: (open: boolean) => void;
    }) => React.ReactNode;
}

const Search = ({ placeholder }: { placeholder: string }) => {
    const router = useRouter();
    const { search: query } = useFilterSearch<{ search?: string }>();

    const [search, setSearch] = useState(query);
    const debouncedSearch = useDebounce({ value: search, delay: 300 });

    useEffect(() => {
        router.navigate({
            search: (prev: Record<string, unknown>) => {
                const next = { ...prev };
                if (debouncedSearch) {
                    next.search = debouncedSearch;
                } else {
                    delete next.search;
                }
                delete next.page;
                return next;
            },
            replace: true,
        } as any);
    }, [debouncedSearch]);

    return (
        <Input
            className="w-full"
            value={search || ''}
            onChange={(event) => setSearch(event.target.value)}
            type="text"
            placeholder={placeholder}
        />
    );
};

const CatalogNavbar: FC<Props> = ({
    sort_type,
    content_type,
    searchPlaceholder,
    renderFilterModal,
}) => {
    const { visible: sidebarVisible, toggle: toggleSidebar } =
        useFiltersSidebar();
    const { count: activeCount } = useActiveFilters();
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    return (
        <>
            <div className="bg-secondary/20 flex flex-col gap-4 rounded-md border p-4 md:flex-row md:items-center">
                <div className="min-w-0 flex-1">
                    <Suspense>
                        <Search placeholder={searchPlaceholder} />
                    </Suspense>
                </div>
                <Separator
                    orientation="vertical"
                    className="h-6 hidden md:block"
                />

                <div className="flex items-center gap-4">
                    <Sort
                        sort_type={sort_type}
                        compact
                        className="min-w-0 flex-1 overflow-hidden md:w-46"
                        placeholder="Сортування"
                    />

                    <Separator orientation="vertical" className="h-6" />

                    {/* Mobile: open filters in a sheet */}
                    <Button
                        variant="outline"
                        size="icon-md"
                        onClick={() => setMobileFiltersOpen(true)}
                        className="relative shrink-0 overflow-visible lg:hidden"
                        aria-label="Фільтри"
                    >
                        <Filter className="size-4" />
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
                                size="icon-md"
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
                        <TooltipContent>
                            <p className="text-sm">
                                {sidebarVisible
                                    ? 'Приховати панель фільтрів'
                                    : 'Показати панель фільтрів'}
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <FilterPresets content_type={content_type} />
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2">
                    <FilterPresetButton />
                </div>
            </div>

            {renderFilterModal({
                open: mobileFiltersOpen,
                onOpenChange: setMobileFiltersOpen,
            })}
        </>
    );
};

export default CatalogNavbar;
