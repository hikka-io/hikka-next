import { Suspense } from 'react';

import { cn } from '../../../utils/utils';
import FiltersModal from '../../modals/anime-filters-modal.component';
import Search from './search';

const AnimeListNavbar = () => {
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
                <FiltersModal sort_type="anime" />
            </div>
        </div>
    );
};

export default AnimeListNavbar;
