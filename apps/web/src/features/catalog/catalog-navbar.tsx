import { type FC, Suspense } from 'react';

import { PanelRightClose, PanelRightOpen } from 'lucide-react';

import type { ContentTypeEnum } from '@hikka/api';

import MaterialSymbolsEventList from '@/components/icons/material-symbols/MaterialSymbolsEventList';
import { MaterialSymbolsGridViewRounded } from '@/components/icons/material-symbols/MaterialSymbolsGridViewRounded';
import { Button } from '@/components/ui/button';
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
import { useFiltersSidebar } from '@/features/filters/hooks/use-filters-sidebar';
import SearchInput from '@/features/filters/search-input';
import type { SortType } from '@/features/filters/sort';
import Sort from '@/features/filters/sort';

import { useCatalogView } from '../filters/hooks/use-catalog-view';

type Props = {
    sort_type: SortType;
    content_type: ContentTypeEnum;
    searchPlaceholder: string;
    renderFilterModal: RenderFiltersModal;
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

    const handleChangeView = ([value]: string[]) => {
        if (!value) return;
        setView(value as Hikka.View);
    };

    return (
        <>
            <div className="surface -mx-4 flex flex-col gap-4 rounded-none border border-x-0 p-4 md:mx-0 md:flex-row md:items-center md:rounded-md md:border-x">
                <div className="min-w-0 flex-1">
                    <Suspense>
                        <SearchInput placeholder={searchPlaceholder} />
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
                        value={[view]}
                        onValueChange={handleChangeView}
                    >
                        <Tooltip>
                            <TooltipTrigger
                                render={
                                    <ToggleGroupItem
                                        value="grid"
                                        aria-label="Сітка"
                                    />
                                }
                            >
                                <MaterialSymbolsGridViewRounded />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Сітка</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger
                                render={
                                    <ToggleGroupItem
                                        value="list"
                                        aria-label="Список"
                                    />
                                }
                            >
                                <MaterialSymbolsEventList />
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
                        <TooltipTrigger
                            render={
                                <Button
                                    variant={
                                        sidebarVisible ? 'default' : 'outline'
                                    }
                                    size="icon-md"
                                    onClick={toggleSidebar}
                                    className="hidden shrink-0 lg:inline-flex"
                                    aria-label={
                                        sidebarVisible
                                            ? 'Приховати фільтри'
                                            : 'Показати фільтри'
                                    }
                                />
                            }
                        >
                            {sidebarVisible ? (
                                <PanelRightClose className="size-4" />
                            ) : (
                                <PanelRightOpen className="size-4" />
                            )}
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
