'use client';

import Search from '../components/Search';
import AiFilterFilled from '@/app/components/icons/AiFilterFilled';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

interface Props {}

const Component = ({}: Props) => {
    const [positionReached, setPositionReached] = useState(
        typeof window !== 'undefined' ? window.scrollY > 40 : false,
    );

    const listenScrollEvent = () => {
        if (window.scrollY > 40) {
            setPositionReached(true);
        } else {
            setPositionReached(false);
        }
    };

    useEffect(() => {
        if (window.innerWidth < 640) {
            window.addEventListener('scroll', listenScrollEvent, {
                passive: true,
            });
        }

        return () => {
            window.removeEventListener('scroll', listenScrollEvent);
        };
    }, []);

    return (
        <div
            className={clsx(
                'flex gap-2 items-end px-4 py-4 md:pt-0 transition bg-transparent rounded-b-lg',
                positionReached && '!bg-black/90',
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
