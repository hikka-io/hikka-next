import { ReactNode } from 'react';

import Filters from '@/app/(pages)/anime/(animeList)/_layout/Filters';
import NavBar from '@/app/(pages)/anime/(animeList)/_layout/NavBar';

interface Props {
    list: ReactNode;
}

// export const runtime = 'edge';

const Component = async ({ list }: Props) => {
    return (
        <div>
            <div className="drawer drawer-end">
                <input
                    id="filterDrawer"
                    type="checkbox"
                    className="drawer-toggle"
                />
                <div className="drawer-content grid grid-cols-1 justify-center lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-16">
                    <div className="flex flex-col gap-8">
                        <NavBar />
                        {list}
                    </div>
                    <div className="order-1 hidden w-full lg:order-2 lg:block">
                        <Filters />
                    </div>
                </div>
                <div className="drawer-side z-10 overflow-y-visible lg:hidden">
                    <label
                        htmlFor="filterDrawer"
                        className="drawer-overlay"
                    ></label>
                    <div className="h-full w-full overflow-y-scroll overscroll-contain bg-base-100 p-8 text-base-content lg:p-4">
                        <Filters />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Component;
