'use client';

import Search from '@/app/anime/(animeList)/_components/Search';
import AntDesignFilterFilled from '~icons/ant-design/filter-filled';
import clsx from 'clsx';
import useScrollTrigger from '@/utils/hooks/useScrollTrigger';
import useIsMobile from '@/utils/hooks/useIsMobile';

interface Props {}

const Component = ({}: Props) => {
    const isMobile = useIsMobile();
    const trigger = useScrollTrigger({
        threshold: 40,
        disableHysteresis: true,
    });

    return (
        <div
            className={clsx(
                'flex gap-2 items-end p-4 md:pt-0 border-b border-b-transparent transition bg-transparent',
                isMobile && trigger && '!bg-black !border-b-secondary',
            )}
        >
            <Search />
            <label
                htmlFor="filterDrawer"
                className="btn drawer-button btn-square btn-outline flex md:hidden"
            >
                <AntDesignFilterFilled />
            </label>
        </div>
    );
};

export default Component;
