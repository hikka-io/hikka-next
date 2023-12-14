'use client';

import clsx from 'clsx';
import AntDesignFilterFilled from '~icons/ant-design/filter-filled';

import Search from '@/app/(pages)/anime/(animeList)/_components/Search';
import useIsMobile from '@/utils/hooks/useIsMobile';
import useScrollTrigger from '@/utils/hooks/useScrollTrigger';

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
                'flex items-end gap-2 border-b border-b-transparent bg-transparent transition',
                isMobile && trigger && '!border-b-secondary !bg-base-100',
            )}
        >
            <Search />
            <label
                htmlFor="filterDrawer"
                className={clsx(
                    'btn btn-square btn-secondary btn-outline drawer-button flex lg:hidden',
                )}
            >
                <AntDesignFilterFilled />
            </label>
        </div>
    );
};

export default Component;
