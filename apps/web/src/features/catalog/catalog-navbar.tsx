import { type FC, Suspense, useEffect, useRef, useState } from 'react';

import { useNavigate } from '@tanstack/react-router';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';

import type { ContentTypeEnum } from '@hikka/api';

import MaterialSymbolsEventList from '@/components/icons/material-symbols/MaterialSymbolsEventList';
import { MaterialSymbolsGridViewRounded } from '@/components/icons/material-symbols/MaterialSymbolsGridViewRounded';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    FilterPresetButton,
    FilterPresets,
    FiltersButton,
    type RenderFiltersModal,
} from '@/features/filters';
import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';
import { useFiltersSidebar } from '@/features/filters/hooks/use-filters-sidebar';
import type { SortType } from '@/features/filters/sort';
import Sort from '@/features/filters/sort';
import useDebounce from '@/services/hooks/use-debounce';

import { useCatalogView } from '../filters/hooks/use-catalog-view';

type Props = {
    sort_type: SortType;
    content_type: ContentTypeEnum;
    searchPlaceholder: string;
    renderFilterModal: RenderFiltersModal;
};

const Search = ({ placeholder }: { placeholder: string }) => {
    const navigate = useNavigate();
    const { search: query } = useFilterSearch<{ search?: string }>();

    const [search, setSearch] = useState(query);
    const [debouncedSearch] = useDebounce({ value: search, delay: 300 });

    const queryRef = useRef(query);
    queryRef.current = query;
    const debouncedRef = useRef(debouncedSearch);
    debouncedRef.current = debouncedSearch;

    useEffect(() => {
        const desired = debouncedSearch || undefined;
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
    const { view, setView } = useCatalogView('catalog');

    const handleChangeView = (value: Hikka.View) => {
        if (!value) return;
        setView(value);
    };

    return (
        <>
            <div className="surface -mx-4 flex flex-col gap-4 rounded-none border border-x-0 p-4 md:mx-0 md:flex-row md:items-center md:rounded-md md:border-x">
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

                    <ToggleGroup
                        value={view}
                        type="single"
                        onValueChange={handleChangeView}
                    >
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <ToggleGroupItem
                                    value="grid"
                                    aria-label="Сітка"
                                >
                                    <MaterialSymbolsGridViewRounded />
                                </ToggleGroupItem>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Сітка</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <ToggleGroupItem
                                    value="list"
                                    aria-label="Список"
                                >
                                    <MaterialSymbolsEventList />
                                </ToggleGroupItem>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Список</p>
                            </TooltipContent>
                        </Tooltip>
                    </ToggleGroup>

                    <Separator orientation="vertical" className="h-6" />

                    <FiltersButton
                        className="lg:hidden"
                        renderModal={renderFilterModal}
                    />

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
        </>
    );
};

export default CatalogNavbar;
