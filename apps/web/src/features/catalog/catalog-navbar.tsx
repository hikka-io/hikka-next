import { type FC, Suspense, useEffect, useRef, useState } from 'react';

import { useNavigate } from '@tanstack/react-router';
import { Filter, PanelRightClose, PanelRightOpen } from 'lucide-react';

import type { ContentTypeEnum } from '@hikka/api';

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
} from '@/features/filters';
import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';
import { useFiltersSidebar } from '@/features/filters/hooks/use-filters-sidebar';
import type { SortType } from '@/features/filters/sort';
import Sort from '@/features/filters/sort';
import useDebounce from '@/services/hooks/use-debounce';

type Props = {
    sort_type: SortType;
    content_type: ContentTypeEnum;
    searchPlaceholder: string;
    renderFilterModal: (props: {
        open: boolean;
        onOpenChange: (open: boolean) => void;
    }) => React.ReactNode;
};

const Search = ({ placeholder }: { placeholder: string }) => {
    const navigate = useNavigate();
    const { search: query } = useFilterSearch<{ search?: string }>();

    const [search, setSearch] = useState(query);
    const [debouncedSearch] = useDebounce({ value: search, delay: 300 });

    // Latest values read inside effects without making them retrigger.
    const queryRef = useRef(query);
    queryRef.current = query;
    const debouncedRef = useRef(debouncedSearch);
    debouncedRef.current = debouncedSearch;

    // Push the debounced input to the URL. Keyed on the debounced input only
    // (NOT `query`) so an external URL change (search modal, back/forward) can't
    // retrigger this with a stale debounced value and wipe the incoming param.
    useEffect(() => {
        const desired = debouncedSearch || undefined;
        // Skip when it matches the URL — else the mount-time fire strips ?page.
        if (desired === (queryRef.current || undefined)) return;

        navigate({
            to: '.',
            search: (prev: Record<string, unknown>) => {
                const next = { ...prev };
                if (desired) {
                    next.search = desired;
                } else {
                    delete next.search;
                }
                delete next.page;
                return next;
            },
            replace: true,
        });
    }, [debouncedSearch, navigate]);

    // Adopt URL `search` changes that originate elsewhere (search modal,
    // back/forward), ignoring the echo of our own debounced push above.
    useEffect(() => {
        if ((query || undefined) !== (debouncedRef.current || undefined)) {
            setSearch(query);
        }
    }, [query]);

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
            <div className="surface-solid flex flex-col gap-4 rounded-md border p-4 md:flex-row md:items-center">
                <div className="min-w-0 flex-1">
                    <Suspense>
                        <Search placeholder={searchPlaceholder} />
                    </Suspense>
                </div>
                <Separator
                    orientation="vertical"
                    className="hidden h-6 md:block"
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
                            <p>
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
