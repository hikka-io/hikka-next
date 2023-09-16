'use client';

import Search from '../components/Search';
import AiFilterFilled from '@/app/components/icons/AiFilterFilled';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

interface Props {}

const Component = ({}: Props) => {
    const [positionReached, setPositionReached] = useState(false);

    const listenScrollEvent = () => {
        const px = window.innerWidth < 640 ? 100 : 180;

        if (window.scrollY > px) {
            setPositionReached(true);
        } else {
            setPositionReached(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', listenScrollEvent);

        return () => {
            window.removeEventListener('scroll', listenScrollEvent);
        };
    }, []);

    return (
        <div
            className={clsx(
                'flex gap-2 items-end sticky top-0 z-[1] -mx-4 px-4 py-4 md:pt-0 transition rounded-b-lg',
                positionReached &&
                    'bg-black/90 backdrop-blur',
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
