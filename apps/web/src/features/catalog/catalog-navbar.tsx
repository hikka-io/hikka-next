import { type FC, Suspense } from 'react';

import type { ContentTypeEnum } from '@hikka/api';

import { Separator } from '@/components/ui/separator';
import {
    FilterPresetButton,
    FilterPresets,
    FiltersButton,
    FiltersSidebarToggle,
    type RenderFiltersModal,
    SearchInput,
    Sort,
} from '@/features/filters';
import type { SortType } from '@/utils/sort';

import ViewToggle from './view-toggle';

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

                    <ViewToggle viewKey="catalog" views={['grid', 'list']} />

                    <Separator orientation="vertical" className="h-6" />

                    <FiltersButton
                        className="lg:hidden"
                        renderModal={renderFilterModal}
                    />

                    <FiltersSidebarToggle />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <FilterPresets content_type={content_type} />
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2">
                    <FilterPresetButton contentType={content_type} />
                </div>
            </div>
        </>
    );
};

export default CatalogNavbar;
