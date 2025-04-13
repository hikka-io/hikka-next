import { Suspense } from 'react';

import { cn } from '@/utils/utils';
import ReadFiltersModal from '../../modals/read-filters-modal.component';
import Search from './search';

const NovelListNavbar = () => {
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
                <ReadFiltersModal sort_type="novel" content_type="novel" />
            </div>
        </div>
    );
};

export default NovelListNavbar;
