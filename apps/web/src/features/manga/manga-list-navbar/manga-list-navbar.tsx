import { ContentTypeEnum } from '@hikka/client';
import { Suspense } from 'react';

import { ReadFiltersModal } from '@/features/modals';
import FilterPresetButton from '@/features/modals/filter-preset-modal/filter-preset-button';
import FilterPresets from '@/features/modals/filter-preset-modal/filter-presets';

import { cn } from '@/utils/utils';

import Search from './search';

const MangaListNavbar = () => {
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
                    content_type={ContentTypeEnum.MANGA}
                />
                <div className="order-1 lg:order-2 flex items-center gap-2">
                    <div className="lg:hidden">
                        <ReadFiltersModal
                            sort_type="manga"
                            content_type={ContentTypeEnum.MANGA}
                        />
                    </div>
                    <FilterPresetButton />
                </div>
            </div>
        </div>
    );
};

export default MangaListNavbar;
