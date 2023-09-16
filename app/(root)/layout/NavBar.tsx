'use client';

import Search from '../components/Search';
import AiFilterFilled from '@/app/components/icons/AiFilterFilled';
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
                'flex gap-2 items-end px-4 py-4 md:pt-0 transition bg-transparent rounded-b-lg',
                isMobile && trigger && '!bg-black/90',
            )}
        >
            <Search />
            <label
                htmlFor="filterDrawer"
                className="btn drawer-button btn-square btn-outline flex md:hidden"
            >
                <AiFilterFilled />
            </label>
        </div>
    );
};

export default Component;
