'use client';

import Search from '@/app/(pages)/anime/(animeList)/_components/Search';
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
                'flex gap-2 items-end border-b border-b-transparent transition bg-transparent',
                isMobile && trigger && '!bg-base-100 !border-b-secondary',
            )}
        >
            <Search />
            <label
                htmlFor="filterDrawer"
                className={clsx("btn btn-secondary drawer-button btn-square btn-outline flex lg:hidden")}
            >
                <AntDesignFilterFilled />
            </label>
        </div>
    );
};

export default Component;
