import { Suspense } from 'react';

import ReadFiltersModal from '@/features/modals/read-filters-modal.component';

import { cn } from '@/utils/utils';

import Search from './search';

const MangaListNavbar = () => {
    return (
        <div
            className={cn(
                'flex items-end gap-2 border-b border-b-transparent bg-transparent transition md:gap-4',
            )}
        >
            <Suspense>
                <Search />
            </Suspense>
            <div className="lg:hidden">
                <ReadFiltersModal sort_type="manga" content_type="manga" />
            </div>
        </div>
    );
};

export default MangaListNavbar;
