import { ContentTypeEnum } from '@hikka/client';
import { Suspense } from 'react';

import { ActiveFilters } from '@/features/filters';
import {
    FilterPresetButton,
    FilterPresets,
    ReadFiltersModal,
} from '@/features/modals';

import { cn } from '@/utils/cn';

import Search from './components/search';

const NovelListNavbar = () => {
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
                    content_type={ContentTypeEnum.NOVEL}
                />
                <div className="order-1 flex items-center gap-2 lg:order-2">
                    <div className="lg:hidden">
                        <ReadFiltersModal
                            sort_type="novel"
                            content_type={ContentTypeEnum.NOVEL}
                        />
                    </div>
                    <FilterPresetButton />
                </div>
            </div>

            <Suspense>
                <ActiveFilters />
            </Suspense>
        </div>
    );
};

export default NovelListNavbar;
