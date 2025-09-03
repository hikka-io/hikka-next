import { ContentTypeEnum } from '@hikka/client';
import { Suspense } from 'react';

import { ReadFiltersModal, FilterPresetButton, FilterPresets } from '@/features/modals';

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

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto]">
                <FilterPresets
                    className="order-2 lg:order-1"
                    content_type={ContentTypeEnum.MANGA}
                />
                <div className="order-1 flex items-center gap-2 lg:order-2">
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
