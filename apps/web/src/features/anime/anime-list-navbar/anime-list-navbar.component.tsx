import { ContentTypeEnum } from '@hikka/client';
import { Suspense } from 'react';

import FiltersModal from '@/features/modals/anime-filters-modal.component';
import FilterPresetButton from '@/features/modals/filter-preset-modal/filter-preset-button.component';
import FilterPresets from '@/features/modals/filter-preset-modal/filter-presets.component';

import { cn } from '@/utils/utils';

import Search from './search';

const AnimeListNavbar = () => {
    return (
        <div className="flex flex-col gap-4">
            <div
                className={cn(
                    'flex items-end gap-2 border-b border-b-transparent bg-transparent transition md:gap-4',
                )}
            >
                <Suspense>
                    <Search />
                </Suspense>
            </div>

            <div className="grid lg:grid-cols-[1fr_auto] grid-cols-1 gap-4">
                <FilterPresets
                    className="order-2 lg:order-1"
                    content_type={ContentTypeEnum.ANIME}
                />
                <div className="order-1 lg:order-2 flex items-center gap-2">
                    <div className="lg:hidden">
                        <FiltersModal sort_type="anime" />
                    </div>
                    <FilterPresetButton />
                </div>
            </div>
        </div>
    );
};

export default AnimeListNavbar;
