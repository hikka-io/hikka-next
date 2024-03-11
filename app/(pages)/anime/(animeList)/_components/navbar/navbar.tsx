import clsx from 'clsx';

import FiltersModal from '@/components/modals/anime-filters-modal';

import Search from './_components/search';

interface Props {}
const Component = ({}: Props) => {
    return (
        <div
            className={clsx(
                'flex items-end gap-2 md:gap-4 border-b border-b-transparent bg-transparent transition',
            )}
        >
            <Search />
            <div className="lg:hidden">
                <FiltersModal type="anime" />
            </div>
        </div>
    );
};

export default Component;
